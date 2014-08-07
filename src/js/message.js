/**
 * Created by muhiro on 2014/07/07.
 */
var message = message || {};
(function() {
//  if ($.ajax) {
//    $.ajax({
//      type: "GET",
//      scriptCharset: 'utf-8',
//      dataType: 'json',
//      url: '../js/message.json',
//      success: function (json) {
//        message.fm = $.extend(true, {}, json);
//        //
//        //      if (null == json || "object" != typeof json) return json;
//        //      this.message = json.constructor();
//        //      for (var attr in json) {
//        //        if (json.hasOwnProperty(attr)) this.message[attr] = json[attr];
//        //      }
//      },
//      error: function () {
//        console.log('error.');
//      }
//    });
//  };
  message.fm = {
    appnamer18: 'アイギスウィジェット',
    appname: 'アイギスウィジェット～一般版～',
    prefix: '王子……、聞こえますか？',
    missionCompleted: 'ミッション が……終わりました……',
    captureStart: '画像を保存しています……',
    captureCompleted: '{filename} が……撮れました……',
    captureError: '{filename} が……撮れませんでした……\n設定を……設定を見直して下さい',
    updateAll: '{dbname}の……更新をしています……',
    reexportCompleted: '{filename}の再生成が……終わりました……'
  }
  message.appname = function() {
    if (settings.config().get('r18')) {
      console.log('r18');
      return message.fm.appnamer18;
    } else {
      console.log('一般');
      return message.fm.appname;
    }
  }
})();
