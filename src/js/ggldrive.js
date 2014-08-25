/*
 * @see http://jsdo.it/kjunichi/yt3k
 * @see http://qiita.com/kjunichi/items/552f13b48685021966e4
 */
var ggldrive = ggldrive || {};
(function() {
  /**
   * Start the file upload.
   * @param {Object} evt Arguments from the file selector.
   */
  ggldrive.getDirectory = function(callback) {
    //console.log("ls start");
    gapi.client.load('drive', 'v2', function () {
      //console.log("gapi.client.load done");
      var myCb = function (result) {
        // フォルダのリストを作成しておく。
        //
        // folderMapにはキーがフォルダID
        // folderMap[key].title フォルダ名
        // folderMap[key].parentId 親フォルダID
        // folderMap[key].parentIdRoot ルートフォルダかどうかの判定結果

        var folderMap = {};
        //console.log("result.length = " +result.length);
        for (var i = 0; i < result.length; i++) {
          //console.log(result[i].mimeType);
          if (!(typeof result[i].mimeType === undefined) &&
            result[i].mimeType == "application/vnd.google-apps.folder") {
            folderMap[result[i].id] = {};
            folderMap[result[i].id].title = result[i].title;
            folderMap[result[i].id].mimeType = result[i].mimeType;
            if (result[i].parents) {
              folderMap[result[i].id].parentId = result[i].parents[0].id;
              folderMap[result[i].id].parentIsRoot = result[i].parents[0].isRoot;
            } else {
              folderMap[result[i].id].parentIsRoot = true;
            }
            //console.log("[" + result[i].id + "]" + result[i].title);
          }
        }
        var fullPath = "";

        function makePath(id) {
          if (!folderMap[id].parentIsRoot) {
            fullPath = folderMap[folderMap[id].parentId].title + "/" + fullPath;
            fullParentsId.push(folderMap[id].parentId);
            makePath(folderMap[id].parentId);
          }
        }

        var optionAry = new Array();
        for (var key in folderMap) {
          if (folderMap[key].mimeType == "application/vnd.google-apps.folder") {
            //console.log("key = " + key);
            fullPath = folderMap[key].title;
            fullParentsId = [];
            makePath(key);

            folderMap[key].fullPath = fullPath;
            folderMap[key].fullParentsId = [];
            folderMap[key].fullParentsId.push(key);
            for (var j = 0; j < fullParentsId.length; j++) {
              folderMap[key].fullParentsId.push(fullParentsId[j]);
            }
            optionAry.push({
               key: key,
               value: fullPath
            });
          }
        }

        callback(optionAry);
      };
      ggldrive.retrieveAllDirectory(myCb);
    });
  }

  ggldrive.retrieveAllDirectory = function(callback) {
    var retrievePageOfDirectory = function (request, result) {
      request.execute(function (resp) {
        result = result.concat(resp.items);
        var nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.files.list({
            'pageToken': nextPageToken
          });
          retrievePageOfDirectory(request, result);
        } else {
          callback(result);
        }
      });
    }

    var initialRequest = gapi.client.drive.files.list({'q': 'mimeType = \'' + 'application/vnd.google-apps.folder' + '\' and trashed = false'});
    retrievePageOfDirectory(initialRequest, []);
  }

  ggldrive.retrieveAllFiles = function(callback) {
    var retrievePageOfFiles = function (request, result) {
      request.execute(function (resp) {
        result = result.concat(resp.items);
        var nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.files.list({
            'pageToken': nextPageToken
          });
          retrievePageOfFiles(request, result);
        } else {
          callback(result);
        }
      });
    }

    var initialRequest = gapi.client.drive.files.list();
    retrievePageOfFiles(initialRequest, []);
  }

  ggldrive.upload = function(type, prefix, data, callback) {
    gglapi.checkAuth(function (authResult) {
      if (authResult && !authResult.error) {
        var filename;
        switch (type) {
          case 'image':
            if (prefix) {
              filename = prefix;
            } else {
              filename = util.getFileName(settings.config().get('format'));
            }
            break;
          case 'text':
            if (prefix) {
              filename = prefix;
            } else {
              filename = util.getTimestamp() + '.txt';
            }
            break;
        }
        gapi.client.load('drive', 'v2', function () {
          switch (type) {
            case 'image':
              //data:image/png;base64,iVB...
              var splitImage = data.split(',');
              var mimeType = splitImage[0].split(';')[0].split(':')[1];
              var base64Data = splitImage[1];
              var contentType = mimeType || 'application/octect-stream';

              ggldrive.uploaddata(filename, base64Data, contentType, function (file) {
                callback(filename);
              });
              break;
            case 'text':
              var base64Data = util.utf8_to_b64(data);
              var contentType = 'text/plain';
              ggldrive.uploaddata(filename, base64Data, contentType, function (file) {
                callback(filename);
              });
              break;
          }
        });
        return filename;
      } else {
        aigisWidget.notice.create(constants.notice.captureError);
      };
    });
  };

  ggldrive.uploaddata = function(fileName, base64Data, contentType, callback) {
    util.log('filename:'+fileName);
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var metadata = {
      'title': fileName,
      'mimeType': contentType
    };
    if (settings.config().get('googleDriveDirectoryID')) {
      metadata['parents'] = [{'id': settings.config().get('googleDriveDirectoryID')}];
    }

    var multipartRequestBody = delimiter +
      'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter +
      'Content-Type: ' + contentType + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' + base64Data + close_delim;

    var request = gapi.client.request({
      'path': '/upload/drive/v2/files',
      'method': 'POST',
      'params': {
        'uploadType': 'multipart'
      },
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    });

    if (!callback) {
      callback = function (file) {
        util.log(file);
      };
    }
    request.execute(callback);
  }
})();
