$(function() {
  ga('send', 'pageview', window.location.toString());
  var browserpopup = false;
  setTimeout(function() {
    $('title').text(message.appname()+' ダッシュボード');
  },500);
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

  $('#r18').prop('checked', settings.config().get('r18'));
  $('#r18').bootstrapSwitch();
  $('#r18').on({
    'switchChange.bootstrapSwitch': function(event, state) {
      console.log(state);
      settings.config().set('r18', state);
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

  $('#exp').click(function() {
    window.open(
      '/browser_action/experience.html',
      'exp'
    );
    return false;
  });

  $('#drop').click(function() {
    window.open(
      '/browser_action/drop.html',
      'drop'
    );
    return false;
  });

  $('#gacha').click(function() {
    window.open(
      '/browser_action/gacha.html',
      'gacha'
    );
    return false;
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
    // $('#money').text(aigisWidget.status().get('money'));
    // $('#rankupsumexp').text(aigisWidget.status().get('experience'));
    // $('#rank').text(aigisWidget.status().get('rank'));
    // $('#vitality').text(aigisWidget.status().get('nowVitality'));
    // $('#stamina').text(aigisWidget.status().get('nowStamina'));
    chrome.runtime.sendMessage({type: constants.msg.badge});

    //captureファイルの更新
    //if (!(settings.config().get('googleDriveUse'))) {
      $('#filelist').show();
      aigisWidget.storage.list(constants.capturedir, function(entries) {
        entries.forEach(function(entry, i) {
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

//      aigisWidget.storage.read(constants.file.dropfile, function(entry) {
//        $('#dropfile').attr('href', entry.toURL());
//      });
//      aigisWidget.storage.read(constants.file.gachafile, function(entry) {
//        $('#gachafile').attr('href', entry.toURL());
//      });
    //}
  }
});
