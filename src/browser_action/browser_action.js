$(function() {
  var browserpopup = false;
  setTimeout(function() {
    $('title').text(constants.appname+' ダッシュボード');
  },500);
  //_gaq.push(["_trackPageview"]);
  ga('send', 'pageview');
  refresh();

  if (!(window.name)) {
    $('#browserpopup').hide();
  } else {
    $('#content').css('width', 'auto');
  }

  $('#aigispop').click(function() {
    chrome.runtime.sendMessage({type: constants.msg.popup});
    if (!(window.name)) {
      window.close();
    }
  });

  $('#option').click(function() {
    window.open(
      '/options_custom/index.html',
      'options'
    );
    if (!(window.name)) {
      window.close();
    }
  });

  $('#browserpopup').click(function() {
    var aigispopup = window.open(
      'browser_action.html',
      'dashbord',
        'width=420' +
        ',height=420' +
        ',left=' + (window.screenX + $(window).width) +
        ',top=' + window.screenY +
        ',location=no' +
        ',menubar=no' +
        ',toolbar=no' +
        ',status=no' +
        ',scrollbars=no' +
        ',resizable=no'
    );
    aigispopup.focus();
    window.close();
  });

  $('#reexport').click(function() {
    chrome.runtime.sendMessage({type: constants.msg.reexportDrop});
    chrome.runtime.sendMessage({type: constants.msg.reexportGacha});
    if (!(window.name)) {
      window.close();
    }
  });

  function refresh() {
    $('#money').text(aigisWidget.status().get('money'));
    $('#rankupsumexp').text(aigisWidget.status().get('experience'));
    $('#rank').text(aigisWidget.status().get('rank'));
    $('#vitality').text(aigisWidget.status().get('nowVitality'));
    $('#stamina').text(aigisWidget.status().get('nowStamina'));
    chrome.runtime.sendMessage({type: constants.msg.badge});

    //captureファイルの更新
    //if (!(settings.config().get('googleDriveUse'))) {
      $('#filelist').show();
      aigisWidget.storage.list(constants.capturedir, function(entries) {
        entries.forEach(function(entry, i) {
          console.log(entry);
          $('<tr>').append($('<td>')
            .append(
              $('<a>')
                .attr('href', entry.toURL())
                .attr('target', '_blank')
                .text(entry.name)
            )
          ).appendTo('#capturelist');
        });
      });

      aigisWidget.storage.read(constants.file.dropfile, function(entry) {
        $('#dropfile').attr('href', entry.toURL());
      });
      aigisWidget.storage.read(constants.file.gachafile, function(entry) {
        $('#gachafile').attr('href', entry.toURL());
      });
    //}
  }
});
