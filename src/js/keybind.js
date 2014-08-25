$(function() {
  var capture = null;
  var images = [];
  var width;
  var height;

  var startTime;

  var canvas = document.getElementById('canvas');
  var ctx    = canvas.getContext('2d');

  var tmpcanvas = document.createElement('canvas');
  var tmpctx;

  //一旦フォーカスしないとaddEventListenerが効かない
  window.focus();

  function test3(cnt) {
//    var canvas = document.getElementById('canvas');

    //video.add(ctx);
    var imageData;
    imageData = ctx.getImageData(0, 0, width, height);
    images.push({duration : new Date().getTime() - startTime, datas : imageData});
    if ((cnt % 10) == 0) {
      chrome.runtime.sendMessage({type: 'canvas_ini'
        , log: cnt
      });
    }
    if (cnt > 50) {
      tmpcanvas.width = width;
      tmpcanvas.height = height;
      tmpctx = tmpcanvas.getContext('2d');
      var capture = new Whammy.Video();
      encodeVideo(capture, 0);
      return;
    }
    setTimeout(function() {
      test3(cnt+1);
    },100);
  }

  function encodeVideo(capture, currentImage) {
    if (currentImage < images.length) {
      tmpctx.putImageData(images[currentImage].datas, 0, 0);
      capture.add(tmpctx, images[currentImage].duration);
      delete images[currentImage];
      currentImage++;
      setTimeout(function() {encodeVideo(capture, currentImage);}, 5);
    } else {
      var output = capture.compile();
      //console.log(output);
      var url = window.URL.createObjectURL(output);
      chrome.runtime.sendMessage({type: 'canvas_key'
        , log: url
      });

    }
  }

  function captureImage() {
    width = canvas.width;
    height = canvas.height;
    tmpcanvas.width = width;
    tmpcanvas.height = height;

    var imageData = ctx.getImageData(0, 0, width, height);
    tmpctx = tmpcanvas.getContext('2d');
    tmpctx.putImageData(imageData, 0, 0);

    //var url = window.URL.createObjectURL(util.dataUrl2blob(canvas.toDataURL('image/png')));
    chrome.runtime.sendMessage({type: constants.msg.config
      ,key: [
        'format'
      ]
    }, function(response) {
      chrome.runtime.sendMessage({type: constants.msg.capture
        ,url: tmpcanvas.toDataURL('image/'+response.format)
      });
    });
  }

  /**
   * スクリーンショット用キーバインド
   */
  $(window).on('keyup',function(e) {
    if(e.shiftKey && e.ctrlKey && e.keyCode === 48) {
      captureImage();
    }
//    return;
//    console.log('window keyup');
//    chrome.runtime.sendMessage({type: 'canvas_ini'
//      , log: 'keyup'
//    });
//    width = canvas.width;
//    height = canvas.height;
//    console.log(width+':'+height);
//    images = [];
//    startTime = new Date().getTime();
//    test3(1);
  });

  $(window).on('click',function(e) {
    window.focus();
  });

//  $('html').keyup(function(e){
//    console.log('html keyup');
//  });
//
//  $('#canvas').keyup(function(e){
//    console.log('canvas keyup');
//  });

//  if(window.addEventListener){
//    // マウスを移動するたびに実行されるイベント
//    console.log('addEvent');
////    window.addEventListener("mousemove" , MouseMove00Func);
//    window.addEventListener("keydown" , Keyup00Func);
//    // アタッチイベントに対応している
////  }else if(window.attachEvent){
////    // マウスを移動するたびに実行されるイベント
////    console.log('attachEvent');
//////    window.attachEvent("onmousemove" , MouseMove00Func);
////    window.attachEvent("keydown" , Keyup00Func);
//  }
////  function MouseMove00Func(e) {
////    //console.log(e.clientX);
////  }
//  function Keyup00Func(e) {
//    console.log('key down');
//  }
//  document.addEventListener('keyup', function(e) {
//    console.log('addEvent keyup');
//  }, false);

});
