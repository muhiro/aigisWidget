/**
 * Created by muhi on 2014/06/28.
 */
var aigisWidget = aigisWidget || {};
(function() {
  'use strict';
  var notice = aigisWidget.notice = function() {};
  /**
   * 通知ウィンドウにメッセージを表示
   * @see https://developer.chrome.com/extensions/richNotifications
   * @param msgno メッセージID
   */
  notice.create = function(msgno, args) {
    var ms = message.fm;
    var fmessage = '';
    var noticeEnabled = false;
    var noticeSoundEnabled = false;
    switch (msgno) {
      case constants.notice.missionCompleted:
        noticeEnabled = settings.config().get('noticeMissionCompleted');
        noticeSoundEnabled = settings.config().get('noticeMissionCompletedSound');
        fmessage = ms.missionCompleted;
        break;
      case constants.notice.captureStart:
        noticeEnabled = settings.config().get('noticeCaptureCompleted');
        fmessage = ms.captureStart;
        break;
      case constants.notice.captureCompleted:
        noticeEnabled = settings.config().get('noticeCaptureCompleted');
        noticeSoundEnabled = settings.config().get('noticeCaptureCompletedSound');
        fmessage = ms.captureCompleted;
        break;
      case constants.notice.captureError:
        noticeEnabled = settings.config().get('noticeCaptureCompleted');
        noticeSoundEnabled = settings.config().get('noticeCaptureCompletedSound');
        fmessage = ms.captureError;
        break;
      case constants.notice.reexportCompleted:
        fmessage = ms.reexportCompleted;
        break;
      default:
        break;
    };
    if (noticeEnabled) {
      fmessage = fmessage.format(args);
      util.log(fmessage);
      chrome.notifications.create('aigis' + util.getTimestamp(), {
        type: 'basic',
        title: message.fm.appname,
        message: message.fm.prefix + "\n" + fmessage,
        //imageUrl : '../img/background.png'
        iconUrl: '../icons/icon128.png'
      }, function (id) {
        console.log(id);
      });
    };
    if (noticeSoundEnabled) {
      aigisWidget.sound.play(constants.file.noticeDefaultSoundFile);
    };
//    window.webkitNotifications.createNotification('../icons/icon48.png', 'タイトル', 'メッセージ');
//    var bg=this;
//    var callback = function(){
//      bg.message='test<br/>test';//独自プロパティを付与
//      var notification = window.webkitNotifications.createHTMLNotification('../notification/notification.html');
//      notification.show();
//    }
//    setTimeout(callback, 1000);
  }
})();
