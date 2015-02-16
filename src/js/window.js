$(function() {
  setTimeout(function() {
    chrome.runtime.sendMessage({type: constants.msg.config
      ,key: [
        'r18'
      ]
    }, function(response) {
      if (response.r18) {
        $('title').text(message.fm.appnamer18);
      } else {
        $('title').text(message.fm.appname);
      }
    });
    $('body').css({
      'position': 'fixed',
      'cursor': 'default'
    });
    $('body').animate({
      'top'     : '-61px',
      'left'    : '-5px'
    },500);
  },500);

  /**
   * 最初の画面サイズ調整
   */
  chrome.runtime.sendMessage({
    type: constants.msg.popupResize,
    init: true
  });

  $(window).on('beforeunload', function(e) {
    chrome.runtime.sendMessage({type: constants.msg.close
      ,screenX: window.screenX
      ,screenY: window.screenY
    });
  });

  /**
   * 画面リサイズしたら戻す
   * @type {boolean}
   */
  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      if ($(window).height() > constants.popup.height) {
        $('body').css('position', 'absolute');
      } else {
        $('body').css('position', 'fixed');
      }
      // リサイズ
      chrome.runtime.sendMessage({
        type: constants.msg.popupResize
      });
      chrome.runtime.sendMessage({type: constants.msg.saveResize
        ,screenX: window.screenX
        ,screenY: window.screenY
      });

    }, 500);
  });
});
