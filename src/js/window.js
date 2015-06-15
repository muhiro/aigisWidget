$(function() {
  var zoomEnable = false;
  var closeAlert = true;

  setTimeout(function() {
    chrome.runtime.sendMessage({type: constants.msg.config
      ,key: [
        'r18'
        ,'zoom'
        ,'closeAlert'
      ]
    }, function(response) {
      if (response.r18) {
        $('title').text(message.fm.appnamer18);
      } else {
        $('title').text(message.fm.appname);
      }
      zoomEnable = response.zoom;
      closeAlert = response.closeAlert;
    });
    $('#ntg-recommend').css('display', 'none');
    $('body').css({
      'position': 'fixed',
      'cursor': 'default'
    });
    $('body').animate({
      'top'     : '-60px',
      //'left'    : '-5px'
      'left'    : '-30px'
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
    if (closeAlert) {
      return "王子……、聞こえますか？\nまだ……結晶が……残ってますよ？";
    }
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
      chrome.runtime.sendMessage({type: constants.msg.config
        ,key: [
          'zoom'
        ]
      }, function(response) {
        zoomEnable = response.zoom;
      });
      if (zoomEnable) {
        $('body').css('position', 'fixed');
        $('#ntg-recommend').css('display', 'none');
        var bb = Math.min($(window).height()/constants.popup.height
            , $(window).width()/constants.popup.width);
        console.log('out:'+bb);
        if (bb > 1) {
          $('body').css('zoom', bb);
          $('#game_frame').transition({
            scale: bb
            , transformOrigin: '0px 0px'
          });
          $('body').animate({
            'top': $('body').top - $('#game_frame').top,
            'left': $('body').left - $('#game_frame').left
          }, 500);
        } else {
          $('body').css('zoom', 1);
          $('#game_frame').transition({
            scale: 1
            , transformOrigin: '0px 0px'
          });
          $('body').animate({
            'top': $('body').top - $('#game_frame').top,
            'left': $('body').left - $('#game_frame').left
          }, 500);
        }
      } else {
        if ($(window).height() > constants.popup.height) {
          $('body').css('position', 'absolute');
        } else {
          $('body').css('position', 'fixed');
        }
        // リサイズ
        chrome.runtime.sendMessage({
          type: constants.msg.popupResize
        });
        chrome.runtime.sendMessage({
          type: constants.msg.saveResize
          , screenX: window.screenX
          , screenY: window.screenY
        });
      }
    }, 500);
  });
});
