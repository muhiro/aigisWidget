var aigisWidget = aigisWidget || {};
(function() {
  var aigispopup = null;

  'use strict';
//  aigisWidget.init();
  var badgestatus = 1;
//  var dispatcher = new aigisWidget.dispatcher();

//  chrome.webRequest.onBeforeRequest.addListener(function(data){
//    if(data.method === 'POST') {
//      var keyword = data.url.match(/millennium-war.net\/(.*)/)[1];
//      var a = data.requestBody.raw[0].bytes;
//      console.log(util.dumpArrayBuffer(a));
//
//      util.log('backgroud:'+util.getTimestamp()+':'+keyword+':'+util.ab2str(data.requestBody.raw[0].bytes));
//      if (dispatcher.routing(keyword)) {
//        dispatcher.requestBody = util.ab2str(data.requestBody.raw[0].bytes);
//      }
//    }
//  },{'urls':[
//    'https://millennium-war.net/*',
//    'https://all.millennium-war.net/*'
//  ]},['requestBody']);
//
//  chrome.webRequest.onCompleted.addListener(function(detail){
//    if(detail.method === 'POST'){
//      dispatcher.execute(detail)
//    }
//  },{'urls':[
//    'https://millennium-war.net/*',
//    'https://all.millennium-war.net/*'
//  ]},[]);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('RECEIVE:'+request.type);
    switch(request.type) {


      case 'canvas_ini':
        console.log(request.log);
        break;
      case 'canvas_key':
        console.log(request.log);
        //var url = webkitURL.createObjectURL(request.log);
//        var filename = '1.webm';
//        aigisWidget.storage.writeblob('test'+'/'+filename, request.log, function(result) {
//        });
        break;

      case constants.msg.config:
        //var response = {config: settings};
        var response = {};
        for (var i = 0; i < request.key.length; i ++) {
          response[request.key[i]] = settings.config().get(request.key[i]);
        }
        sendResponse(response);
        break;

      case constants.msg.notice:
        aigisWidget.notice.create(request.noticeid, request.args);
        break;

      case constants.msg.badge:
        var value = '';
        var nextmodified = null;
        var sysdate = new Date();
        if (badgestatus == 0) {
          value = String(aigisWidget.status().get('nowVitality'));
          nextmodified = new Date(aigisWidget.status().get('lastmodifiedVitality'));
          nextmodified.setMinutes(nextmodified.getMinutes() + 3);
        } else {
          value = String(aigisWidget.status().get('nowStamina'));
          nextmodified = new Date(aigisWidget.status().get('lastmodifiedStamina'));
          nextmodified.setMinutes(nextmodified.getMinutes() + 60);
        }
        if ( (value !== undefined) && (nextmodified > sysdate) ) {
          //更新がされているとしてbadgeを描画
          chrome.browserAction.setBadgeText({text: value});
        }
        //badgestatus = (badgestatus === 1) ? 0 : 1;
        break;

      case constants.msg.popup:
        var url;
        if (settings.config().get('r18')) {
          url = constants.aigisr18url;
        } else {
          url = constants.aigisurl;
        }
        //ツールバーは72
        aigispopup = window.open(
          url,
          'main',
            'width=' + constants.popup.width +
            ',height=' + constants.popup.height +
            ',left=' + aigisWidget.status().get('screenX') +
            ',top=' + aigisWidget.status().get('screenY') +
            ',location=no' +
            ',menubar=no' +
            ',toolbar=no' +
            ',status=no' +
            ',scrollbars=no' +
            ',resizable=no'
        );
        aigispopup.focus();
        ga('send', 'pageview', url+'&open=true');
        ga('send', 'event', 'view', 'load', 'start aigis');
//    chrome.windows.create({
//      url: 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=156462/?widget=true',
//      width:  constants.popup.width,
//      height: constants.popup.height,
//      left: 100,
//      top: 100,
//      type: 'popup'
//    },function(window){
//    });
        break;
      case constants.msg.popupResize:
        //console.log("%s:%s", sender.tab.windowId, request.type);
        if ( (settings.config().get('widgetResize') ) || (request.init) ) {
          chrome.windows.get(sender.tab.windowId, function (mainwin) {
            var wdiff = (constants.popup.width - sender.tab.width);
            var hdiff = (constants.popup.height - sender.tab.height);

            if ((wdiff != 0 && wdiff > -100 && wdiff < 100) || (hdiff != 0 && hdiff > -100 && hdiff < 100)) {
              var updateWindow = {
                width: mainwin.width + (constants.popup.width - sender.tab.width),
                height: mainwin.height + (constants.popup.height - sender.tab.height)
              };
              //console.log("%s,%s", updateWindow.width, updateWindow.height);
              chrome.windows.update(mainwin.id, updateWindow, function (nWin) {
              });
            }
          });
        }
        break;

      case constants.msg.movie:
/*
        canvaspopup = window.open(
          'test.html',
          'sub',
            'width=' + constants.popup.width +
            ',height=' + constants.popup.height +
            ',left=' + aigisWidget.status().get('screenX') +
            ',top=' + aigisWidget.status().get('screenY') +
            ',location=no' +
            ',menubar=no' +
            ',toolbar=no' +
            ',status=no' +
            ',scrollbars=no' +
            ',resizable=no'
        );
*/
       video = new Whammy.Video(5);

      console.log(sender);
        aigisWidget.storage.removeRecursively('/test', function () {
          aigisWidget.storage.mkdir('/test', function () {
            setTimeout(function() {
              test2(sender.tab.windowId, 1);
            },100);
          });
        });
        break;

      case constants.msg.capture:
        //console.log('%d:%d', sender.tab.windowId, request.type);
        //console.log('capture format:%s', settings.config().get("format"));
        aigisWidget.notice.create(constants.notice.captureStart);
//        chrome.windows.get(sender.tab.windowId, function (capWin) {
//          chrome.tabs.captureVisibleTab(capWin.id, {"format": settings.config().get("format")}, function(dataUrl) {
            //console.log("dataUrl:%s", dataUrl);
            var filename = util.getFileName(util.Ext[settings.config().get("format")]);

            aigisWidget.storage.writeblob(constants.capturedir+'/'+filename, util.dataUrl2blob(request.url), function(result) {
            //aigisWidget.storage.writeblob(constants.capturedir+'/'+filename, request.url, function(result) {
              if (settings.config().get('googleDriveUse')) {
                chrome.runtime.sendMessage({type: constants.msg.uploadImageGoogleDrive
                  ,fileName: filename
                  ,fullPath: constants.capturedir+'/'+filename
                });
              } else {
                aigisWidget.notice.create(constants.notice.captureCompleted, {filename: filename});
              }
            });
            aigisWidget.storage.list(constants.capturedir, function(entries) {
              entries.forEach(function (entry, i) {
                if (i >= constants.localcapturegen) {
                  aigisWidget.storage.remove(entry.fullPath, function () {});
                }
              });
            });
//          });
//        });
        break;

      case constants.msg.updateDrop:
        var drop = request.drop;
        var db = new aigisWidget.aigisdb();
        var sysdate = new Date();

        db.open(function() {
          db.putDrop(
            sysdate.getTime()
            , drop.mapid
            , drop.mapname
            , drop.star
            , drop.cleartime
            , drop.drop
            , function () {
              db.close();
//              aigisWidget.storage.append(constants.file.dropfile
//                ,aigisWidget.exportformatDrop(sysdate, drop)
//                , function() {
//                  chrome.runtime.sendMessage({type: constants.msg.uploadFileGoogleDrive
//                    ,fileName: constants.file.dropfile
//                    ,fullPath: '/'+constants.file.dropfile
//                  });
//                });
            }
          );
        });
        break;

      case constants.msg.updateGacha:
        var gacha = request.gacha;
        var db = new aigisWidget.aigisdb();
        var sysdate = new Date();
        db.open(function() {
          db.putGacha(
            sysdate.getTime()
            , gacha.type
            , gacha.classid
            , gacha.classname
            , gacha.unitid
            , gacha.unitname
            , gacha.rarity
            , function () {
              db.close();

//              aigisWidget.storage.append(constants.file.gachafile
//                ,aigisWidget.exportformatGacha(sysdate, gacha)
//                , function() {
//                  chrome.runtime.sendMessage({type: constants.msg.uploadFileGoogleDrive
//                    ,fileName: constants.file.gachafile
//                    ,fullPath: '/'+constants.file.gachafile
//                  });
//              });
            }
          );
        });
        break;

      case constants.msg.updateAllDrop:
        var db = new aigisWidget.aigisdb();
        aigisWidget.notice.create(
          constants.notice.updateAll
          , {dbname: constants.file.dropfile}
        );
        db.open(function() {
          db.updateAllDrop(function () {
            db.close();
            chrome.runtime.sendMessage({type: constants.msg.reexportDrop});
          });
        });
        break;

      case constants.msg.updateAllGacha:
        var db = new aigisWidget.aigisdb();
        aigisWidget.notice.create(
          constants.notice.updateAll
          , {dbname: constants.file.gachafile}
        );
        db.open(function() {
          db.updateAllGacha(function () {
            db.close();
            chrome.runtime.sendMessage({type: constants.msg.reexportGacha});
          });
        });
        break;

      case constants.msg.reexportDrop:
        aigisWidget.storage.remove(constants.file.dropfile, function() {
//          var db = new aigisWidget.aigisdb();
//          db.open(function() {
//            db.getAllDrop(function(drops) {
//              if(drops.length < 1) {
//                db.close();
//                return;
//              }
//              util.asynceach(drops, function(drop) {
//                var deferred = new $.Deferred;
//                aigisWidget.storage.append(constants.file.dropfile
//                  , aigisWidget.exportformatDrop(new Date(drop.timestamp), drop)
//                  , function () {
//                    //書き込み完了してから次の書き込み要求
//                    deferred.resolve();
//                  });
//                return deferred.promise();
//              }, function() {
//                //終了処理
//                db.close();
//                chrome.runtime.sendMessage({type: constants.msg.uploadFileGoogleDrive
//                  , fileName: constants.file.dropfile
//                  , fullPath: '/'+constants.file.dropfile
//                });
//                aigisWidget.notice.create(constants.notice.reexportCompleted
//                  , {filename: constants.file.dropfile}
//                );
//              });
//            });
//          });
        });
        break;

      case constants.msg.reexportGacha:
        aigisWidget.storage.remove(constants.file.gachafile, function() {
//          var db = new aigisWidget.aigisdb();
//          db.open(function () {
//            db.getAllGacha(function (gachas) {
//              if(gachas.length < 1) {
//                db.close();
//                return;
//              }
//              util.asynceach(gachas, function(gacha) {
//                var deferred = new $.Deferred;
//                aigisWidget.storage.append(constants.file.gachafile
//                  , aigisWidget.exportformatGacha(new Date(gacha.timestamp), gacha)
//                  , function () {
//                    //書き込み完了してから次の書き込み要求
//                    deferred.resolve();
//                  });
//                return deferred.promise();
//              }, function() {
//                //終了処理
//                db.close();
//                chrome.runtime.sendMessage({type: constants.msg.uploadFileGoogleDrive
//                  , fileName: constants.file.gachafile
//                  , fullPath: '/'+constants.file.gachafile
//                });
//                aigisWidget.notice.create(constants.notice.reexportCompleted
//                  , {filename: constants.file.gachafile}
//                );
//              });
//            });
//          });
        });
        break;

      case constants.msg.uploadImageGoogleDrive:
        aigisWidget.storage.readdataurl(request.fullPath, function(data) {
          ggldrive.upload('image', request.fileName, data, function(filename) {
            aigisWidget.notice.create(constants.notice.captureCompleted, {filename: request.fileName});
          });
        });
        break;

      case constants.msg.uploadFileGoogleDrive:
        //TODO:今のやり方だと同名ファイルをgoogle driveにアップロードすると上書きされない
//        aigisWidget.storage.readdataurl(request.fullPath, function(data) {
//          data.file(
//            function(file) {
//              var reader = new FileReader();
//              reader.onloadend = function(e) {
//                ggldrive.upload('text', request.fileName, e.target.result, function(filename) {});
//              };
//              reader.readAsText(file);
//            }
//          )
//        });
        break;

      case constants.msg.saveResize:
        aigisWidget.status().set('screenX', request.screenX);
        aigisWidget.status().set('screenY', request.screenY);
        break;

      case constants.msg.close:
        aigisWidget.status().set('screenX', request.screenX);
        aigisWidget.status().set('screenY', request.screenY);
        var url;
        if (settings.config().get('r18')) {
          url = constants.aigisr18url;
        } else {
          url = constants.aigisurl;
        }
        ga('send', 'pageview', url+'&close=true');
        ga('send', 'event', 'view', 'load', 'end aigis');
        break;

      case constants.msg.logger:
        console.log(request.log);
        aigisWidget.storage.append(constants.file.debugLogFile, request.log, function() {
          aigisWidget.storage.metainfo(constants.file.debugLogFile, function(meta) {
            if (meta.size > constants.debuglogsize) {
              aigisWidget.storage.remove(constants.file.debugLogBakFile, function() {
                aigisWidget.storage.rename('/', constants.file.debugLogFile, constants.file.debugLogBakFile);
              });
            }
          });
        });
        break;

      case constants.msg.test:
        break;
    }
  });
})();
