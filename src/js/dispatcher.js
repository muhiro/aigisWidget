/**
 * Created by muhi on 2014/07/04.
 */
var aigisWidget = aigisWidget || {};
(function() {
  'use strict';
  var dispatcher = aigisWidget.dispatcher = function() {
    this.keyword = null;
    this.requestBody = null;
    this.responseHeader = null;
  };

  dispatcher.prototype.routing = function(_keyword) {
    //byte→XML→JSONの処理が重そうに思ったから必要なPOSTしか処理しない
    this.keyword = _keyword;
    switch (this.keyword) {
      //case 'ciys3wed'://王子のステータス更新
      //  this.invoker = aigisWidget.statusInvoker;
      //  return true;
      //case 'ntwh57oy'://クエスト失敗
      //  this.invoker = aigisWidget.finishInvoker;
      //  return true;
      //case 'D0zA0jMx'://ガチャ結果
      //  this.invoker = aigisWidget.gachaInvoker;
      //  return true;
      //case 'x4v45zb2'://ガチャ前
      //  this.invoker = aigisWidget.gachaInvoker;
      //  return true;
      case 'zzdfsknw'://プレボ
        this.invoker = aigisWidget.preboInvoker;
        return true;
      default :
        this.invoker = null;
        return false;
    };
  };

  dispatcher.prototype.execute = function(_responseHeader) {
    if (this.invoker) {
      this.responseHeader = _responseHeader;
      if (this.responseHeader.statusCode == '200') {
        //console.log(JSON.stringify(jsonObj));
        var x2js = new X2JS();
        this.invoker.execute(x2js.xml_str2json( this.requestBody ));
      };
    };
  };
})();
