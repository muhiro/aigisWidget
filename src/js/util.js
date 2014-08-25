var util = util || {};
(function() {
  'use strict';
  util.Ext = {
    'jpeg': 'jpg'
    ,'png': 'png'
  }
  util.ab2str = function(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  util.dumpArrayBuffer = function(buf, delimiter){
    var rslt, line, bytes, i, l, s;

    delimiter||(delimiter=' ');
    if(!buf instanceof ArrayBuffer) {
      throw new Error('required ArrayBuffer in first argument');
    }

    bytes = new Uint8Array(buf);
    for(rslt=[],line=[],i=0,l=bytes.length; i<l; i++){
      if(!(i&0xf)){
        rslt.push(line.join(delimiter));
        line=[];
      }
      line.push(('0'+(bytes[i]).toString(16)).substr(-2));
    };
    if(line.length) rslt.push(line.join(delimiter))
    return rslt.join("\n");
  }

  util.dataUrl2blob = function(dataUrl) {
    // DataURL のデータ部分を抜き出し、Base64からバイナリに変換
    //data:image/png;base64,XXXX
    var bin = window.atob(dataUrl.split(',')[1]);
    var mime = dataUrl.split(',')[0].split(';')[0].split(':')[1];
    // 空の Uint8Array ビューを作る
    var buffer = new Uint8Array(bin.length);
    // Uint8Array ビューに 1 バイトずつ値を埋める
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    // Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
    return new Blob([buffer.buffer], {type: mime});
  };

  /**
   * @see http://nanoappli.com/blog/archives/768
   * @param params
   * @param proc
   * @param done
   */
  util.asynceach = function( params, proc, done ) {
    var paramList = params.concat();
    var _async = function() {
      var slipNo = paramList.shift();

      var promise = proc( slipNo );
      promise.done(function(){
        if ( paramList.length <= 0 ) {
          done();
          return;
        }
        _async();
      });
      promise.fail(function(e){
        return false;
      });
    };
    _async();
  }

  /**
   * デバッグ用のログ
   * @param {string} str
   */
  util.log = function(str, e) {
    var strlog = str;
    if ((strlog.indexOf('\n')) < 0) {
      strlog += '\n';
    }
    strlog = util.getTimestamp()+' '+strlog;
    if (settings.config().get('debugLog') == true) {
      if (e) {
        console.log(e);
        str = str + '\n' + e.message;
        if (e.stack) {
          str = str + '\n' + e.stack;
        }
      }
      chrome.runtime.sendMessage({type: constants.msg.logger
        , log: strlog});
    }
  };

  /**
   * @return {string} filename
   */
  util.getFileName = function(ext) {
    var now  = new Date();
    var filename = settings.config().get('fileNameformat');
    filename = filename.replaceAll('%Y', ('0000' + (now.getFullYear())).slice(-4))
      .replaceAll('%m', ('00' + (now.getMonth()+1)).slice(-2))
      .replaceAll('%d', ('00' + (now.getDate())).slice(-2))
      .replaceAll('%H', ('00' + (now.getHours())).slice(-2))
      .replaceAll('%M', ('00' + (now.getMinutes())).slice(-2))
      .replaceAll('%S', ('00' + (now.getSeconds())).slice(-2));
    return util.filenameEscape(filename)+'.'+ext;
  };

  util.filenameEscape = function(filename) {
    // ヤバイ文字を変換 [/, *, ?, ", <, >, \] にマッチ
    return filename.replace(/\/|\*|\?|"|<|>|\\/gi, '_');
  };

  util.getTimestamp = function() {
    var now  = new Date();
    var ts = '%Y%m%d%H%M%S';
    ts = ts.replaceAll('%Y', ('0000' + (now.getFullYear())).slice(-4))
      .replaceAll('%m', ('00' + (now.getMonth()+1)).slice(-2))
      .replaceAll('%d', ('00' + (now.getDate())).slice(-2))
      .replaceAll('%H', ('00' + (now.getHours())).slice(-2))
      .replaceAll('%M', ('00' + (now.getMinutes())).slice(-2))
      .replaceAll('%S', ('00' + (now.getSeconds())).slice(-2));
    return ts;
  };

  /**
   * @see from http://ecmanaut.blogspot.jp/2006/07/encoding-decoding-utf8-in-javascript.html
   * @param str
   * @returns {string}
   */
  util.utf8_to_b64 = function(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * 指定した数のスペースを返す
   * ※インデント用
   * @param len
   * @returns {string}
   */
  util.spaces = function(len) {
    var s = '';
    var indent = len*4;
    var i = 0;
    for (i=0;i<indent;i++) {s += " ";}

    return s;
  }

  /**
   * XMLフォーマットの文字列を渡すと
   * 整形した文字列を返す
   */
  util.format_xml = function(str) {
    var xml = '';

    // タグの区切りで改行コードを挿入
    str = str.replace(/(>)(<)(\/*)/g,"$1\n$2$3");

    // インデント周りの値
    var pad = 0;
    var indent;
    var node;

    // 改行コードで分割
    var strArr = str.split("\n");

    for (var i = 0; i < strArr.length; i++) {
      indent = 0;
      node = strArr[i];

      if(node.match(/.+<\/\w[^>]*>$/)) { //一行で完結しているタグはそのまま
        indent = 0;
      } else if(node.match(/^<\/\w/)) { // 閉じタグ時はインデントを減らす
        if (pad > 0){pad -= 1;}
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)){ // 開始タグはインデントを増やす
        indent = 1;
      } else {
        indent = 0;
      }
      xml += util.spaces(pad) + node + "\n";
      pad += indent;
    }
    return xml;
  }

  util.computeDuration = function(ms){
    var h = String(Math.floor(ms / 3600000) + 100).substring(1);
    var m = String(Math.floor((ms - h * 3600000)/60000)+ 100).substring(1);
    var s = String(Math.round((ms - h * 3600000 - m * 60000)/1000)+ 100).substring(1);
    return h+':'+m+':'+s;
  }
})();
/**
 * @see http://tmlife.net/programming/javascript/javascript-string-format.html
 */
if (String.prototype.format == undefined) {
  String.prototype.format = function(arg)
  {
    // 置換ファンク
    var rep_fn = undefined;
    // オブジェクトの場合
    if (typeof arg == "object") {
      rep_fn = function(m, k) { return arg[k]; }
    }
    // 複数引数だった場合
    else {
      var args = arguments;
      rep_fn = function(m, k) { return args[ parseInt(k) ]; }
    }
    return this.replace( /\{(\w+)\}/g, rep_fn );
  }
}

/**
 * @see http://www.syboos.jp/webjs/doc/string-replace-and-replaceall.html
 */
if (String.prototype.replaceAll == undefined) {
  // 全置換：全ての文字列 org を dest に置き換える
  String.prototype.replaceAll = function (org, dest) {
    return this.split(org).join(dest);
  }
}

Date.prototype.toLocaleString = function () {
  return [
    this.getFullYear(),
    this.getMonth() + 1,
    this.getDate()
  ].join('/') + ' '
  + this.toLocaleTimeString();
}
