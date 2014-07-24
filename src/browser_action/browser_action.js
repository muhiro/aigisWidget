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

  $('#test').click(function() {
//    var dispatcher = new aigisWidget.dispatcher();
//
//    var test = '<DA>  <UI T="I">    <V>11240883</V>  </UI>  <UK T="S">    <V>1405892068988</V>  </UK>  <CT T="D">    <V>735434.2004861086606979</V>  </CT>  <AC T="I">    <V>1</V>  </AC><VN>1.5.3</VN>  <ST>1300</ST>  <HS>7832839</HS></DA>';
//    if (dispatcher.routing('ciys3wed')) {
//      dispatcher.requestBody = test;
//    }
//    var a = {};
//    a.statusCode = '200';
//    dispatcher.execute(a);
//
//    var test = '<DA>  <UI T="I">    <V>11240883</V>  </UI>  <UK T="S">    <V>1405892068988</V>  </UK>  <CT T="D">    <V>735434.2004861086606979</V>  </CT>  <AC T="I">    <V>1</V>  </AC>  <RT>    <LG>      <TG T="S">        <V>finishQuest</V>      </TG>      <TT T="S">        <V>1101 3</V>      </TT>    </LG>    <PU2>      <CR>        <A1 T="I">          <V>2</V>          <V>64</V>          <V>74</V>          <V>64</V>        </A1>        <A2 T="I">          <V>10001</V>          <V>101</V>          <V>101</V>          <V>101</V>        </A2>        <A3 T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </A3>        <A4 T="I">          <V>65</V>          <V>65</V>          <V>72</V>          <V>65</V>        </A4>        <A5 T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </A5>        <AD T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </AD>        <A6 T="I">          <V>1</V>          <V>1</V>          <V>1</V>          <V>1</V>        </A6>        <A7 T="I">          <V>191</V>          <V>190</V>          <V>189</V>          <V>188</V>        </A7>        <A8 T="I">          <V>-1</V>          <V>-1</V>          <V>-1</V>          <V>-1</V>        </A8>        <A9 T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </A9>        <AA T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </AA>        <AB T="I">          <V>-640511844</V>          <V>-327960860</V>          <V>-2128431456</V>          <V>-413625541</V>        </AB>        <AE T="I">          <V>1</V>          <V>1</V>          <V>1</V>          <V>1</V>        </AE>        <AC T="I">          <V>0</V>          <V>0</V>          <V>0</V>          <V>0</V>        </AC>        <UnitID T="I">          <V>191</V>          <V>190</V>          <V>189</V>          <V>188</V>        </UnitID>        <RC T="I">          <V>4</V>        </RC>      </CR>    </PU2>    <GP>      <A1 T="I">        <V>1562095</V>      </A1>      <A2 T="I">        <V>858462</V>      </A2>      <A3 T="I">        <V>143</V>      </A3>      <A4 T="I">        <V>130</V>      </A4>      <A5 T="I">        <V>1</V>      </A5>      <A6 T="I">        <V>735434</V>      </A6>      <A7 T="F">        <V>0.19750012</V>      </A7>      <A8 T="I">        <V>735434</V>      </A8>      <A9 T="F">        <V>0.16289352</V>      </A9>      <AA T="I">        <V>8</V>      </AA>      <AB T="I">        <V>5</V>      </AB>      <AC T="I">        <V>4</V>      </AC>      <AD T="I">        <V>0</V>      </AD>      <AE T="I">        <V>130</V>      </AE>      <AF T="I">        <V>0</V>      </AF>      <AG T="I">        <V>589835</V>      </AG>      <AH T="I">        <V>65548</V>      </AH>    </GP>    <BP>      <VN T="S">        <V>1.0.0</V>      </VN>      <UX T="I">        <V>191</V>      </UX>    </BP>  </RT>  <VN>1.5.3</VN>  <ST>1301</ST>  <HS>7832839</HS></DA>';
//    if (dispatcher.routing('ciys3wed')) {
//      dispatcher.requestBody = test;
//    }
//    var a = {};
//    a.statusCode = '200';
//    dispatcher.execute(a);


//    var db = new aigisWidget.aigisdb();
//    db.open(function() {
//      db.getAllDrop(function(drops) {
//        console.log(drops);
//        db.getAllGacha(function(gacha) {
//          console.log(gacha);
//        });
//      });
//    });
    //db.dropdb();

    var gachas = new Array();
    gachas.push({
      timestamp: new Date().getTime(), rarity: '黒', type: '1', classid: '1001', classname: 'クラス名', unitid: '1001', unitname: 'ユニット名最初'
    })
    gachas.push({
      timestamp: new Date().getTime(), rarity: '黒', type: '1', classid: '1001', classname: 'クラス名', unitid: '1001', unitname: 'ユニット名1'
    })
    gachas.push({
      timestamp: new Date().getTime(), rarity: '黒', type: '1', classid: '1001', classname: 'クラス名', unitid: '1001', unitname: 'ユニット名2'
    })
    gachas.push({
      timestamp: new Date().getTime(), rarity: '黒', type: '1', classid: '1001', classname: 'クラス名', unitid: '1001', unitname: 'ユニット名最後'
    })

//    for (var i = 0; i < gachas.length; i++) {
//      var gacha = gachas[i];
    aigisWidget.storage.remove(constants.file.gachafile, function() {
      //$.each(gachas, function(g, idx) {
      util.asynceach(gachas, function(gacha) {
        var d = new $.Deferred;
        //各処理
        console.log(gacha);
//        var gacha = gachas[g];
        aigisWidget.storage.append(constants.file.gachafile
          , aigisWidget.exportformatGacha(new Date(gacha.timestamp), gacha)
          , function () {
            console.log('exort');
            d.resolve();
          });
        return d.promise();
      }, function() {
        //終了処理
        console.log('loop:end');
      });
    });

//    aigisWidget.storage.remove(constants.file.gachafile, function () {
//      aigisWidget.storage.append(constants.file.gachafile
//        , aigisWidget.exportformatGacha(new Date(gachas[0].timestamp), gachas[0])
//        , function () {
//          aigisWidget.storage.append(constants.file.gachafile
//            , aigisWidget.exportformatGacha(new Date(gachas[1].timestamp), gachas[1])
//            , function () {
//              aigisWidget.storage.append(constants.file.gachafile
//                , aigisWidget.exportformatGacha(new Date(gachas[2].timestamp), gachas[2])
//                , function () {
//                  console.log('exort');
//                });
//            });
//        });
//    });
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
