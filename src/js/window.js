var window = window || {};
$(function() {
  setTimeout(function() {
    $('title').text(constants.appname);
    $('body').css({
      'position': 'fixed',
      'cursor': 'default'
    });
    $('body').animate({
      'top'     : '-59px',
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

  /**
   * スクリーンショット用キーバインド
   */
  $(window).on('keyup',function(e) {
    if(e.shiftKey && e.ctrlKey && e.keyCode === 48) {
      chrome.runtime.sendMessage({type: constants.msg.capture});
    }
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
      // リサイズ
      chrome.runtime.sendMessage({type: constants.msg.popupResize});
      chrome.runtime.sendMessage({type: constants.msg.saveResize
        ,screenX: window.screenX
        ,screenY: window.screenY
      });

    }, 500);
  });
});
