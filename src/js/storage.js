/**
 * Created by muhi on 2014/07/13.
 */
var aigisWidget = aigisWidget || {};
(function() {
  'use strict';
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//  BlobBuilder = WebKitBlobBuilder;

  var storage = aigisWidget.storage = function() {};
  storage.errorHandler = function (e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };
    console.log('Error: ' + msg);
  }

  storage.list = function(dir, callback) {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function (bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function (fs) {
        fs.root.getDirectory(dir, {create: false}, function (dirEntry) {
          var dirReader = dirEntry.createReader();
          var entries = [];
          var readEntries = function () {
            dirReader.readEntries(function (results) {
              if (1 > results.length) {
                if (callback) {
                  console.log(entries);
                  callback(entries.sort(function(a, b) {
                    return (a.modificationTime < b.modificationTime) ? 1 : -1;
                  }));
                }
              } else {
                util.asynceach(results, function(f) {
                  var deferred = new $.Deferred;
                  f.getMetadata(function(metaData) {
                    f.size = metaData.size;
                    f.modificationTime = metaData.modificationTime;
                    //entries.push.apply(entries, f);
                    entries.push(f);
                    //メタ取得完了してから次の取得要求
                    deferred.resolve();
                  });
                  return deferred.promise();
                }, function() {
                  //終了処理
                  readEntries();
                });
              }
            }, storage.errorHandler);
          };
          readEntries();
        });
      });
    }, storage.errorHandler);
  }

  storage.findReaddataurl = function(regex, callback) {
    storage.list(regex.split('/').reverse().slice(1).reverse().join('/'), function(entries) {
      var regexobj = new RegExp(regex);
      entries.forEach(function(entry, i) {
        if (regexobj.test(entry.name)) {
          storage.readdataurl(entry.fullPath, callback);
          return;
        }
      });
    });
  }

  storage.find = function(regex, callback) {
    storage.list(function(entries) {
      var regexobj = new RegExp(regex);
      var ret = [];
      entries.forEach(function(entry, i) {
        if (regexobj.test(entry.name)) {
          ret.push.apply(entries, entry);
        }
      });
      if (callback) {
        callback(ret.sort());
      }
    });
  }

  storage.writeblob = function(filepath, data, callback) {
    storage.mkdir(filepath.split('/').reverse().slice(1).reverse().join('/'), function() {
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function (bytes) {
        window.requestFileSystem(window.PERSISTENT, bytes, function (fs) {
          fs.root.getFile(filepath, {create: true}, function (fileEntry) {

            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function (e) {
                fileWriter.onwriteend = function () {};
                // You need to explicitly set the file size to truncate
                // any content that might was there before
                fileWriter.truncate(blobData.size);
                util.log('writeblob success')
                if (callback) {
                  callback(true);
                }
              };

              fileWriter.onerror = function (e) {
                util.log('writeblob error:', e)
                if (callback) {
                  callback(false);
                }
              };
              //var blobData = new Blob(data);
              var blobData = data;
              fileWriter.write(blobData);
            });
          }, storage.errorHandler);
        });
      }, storage.errorHandler);
    });
  }

  storage.append = function(filepath, data, callback) {
    // loggerが使うからエラーの場合はconsoleへ
    storage.mkdir(filepath.split('/').reverse().slice(1).reverse().join('/'), function() {
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function (bytes) {
        window.requestFileSystem(window.PERSISTENT, bytes, function (fs) {
          fs.root.getFile(filepath, {create: true}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.seek(fileWriter.length); // Start write position at EOF.
              fileWriter.onwriteend = function (e) {
                if (callback) {
                  callback(true);
                }
              };

              fileWriter.onerror = function (e) {
                if (callback) {
                  callback(false);
                }
              };
              var blobData = new Blob([data]);
              fileWriter.write(blobData);
            });
          }, storage.errorHandler);
        });
      }, storage.errorHandler);
    });
  }

  storage.read = function(filepath, callback) {
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function(fs) {
        fs.root.getFile(filepath, {create: true}, function(fileEntry) {
          callback(fileEntry);
//          fileEntry.file(
//            function(file) {
//              var reader = new FileReader();
//              reader.onloadend = function(e) {
//                if (callback) {
//                  callback(e.target.result);
//                }
//              };
//              //reader.readAsText(file);
//              reader.readAsDataURL(file);
//            }
        }, storage.errorHandler);
      });
    }, storage.errorHandler);
  }

  storage.readdataurl = function(filepath, callback) {
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function(fs) {
        fs.root.getFile(filepath, {create: true}, function(fileEntry) {
          fileEntry.file(
            function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                if (callback) {
                  callback(e.target.result);
                }
              };
              //reader.readAsText(file);
              reader.readAsDataURL(file);
            }
          );
        }, storage.errorHandler);
      });
    }, storage.errorHandler);
  }

  storage.mkdir = function(dir, callback) {
    if (dir) {
      navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function (bytes) {
        window.requestFileSystem(window.PERSISTENT, bytes, function (fs) {
          var createDir = function (parentDirEntry, folders) {
            // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
            if (folders[0] == '.' || folders[0] == '') {
              folders = folders.slice(1);
            }
            parentDirEntry.getDirectory(folders[0], {create: true}, function (dirEntry) {
              // Recursively add the new subfolder (if we still have another to create).
              if (folders.length) {
                createDir(dirEntry, folders.slice(1));
              }
            }, storage.errorHandler);
          };
          createDir(fs.root, dir.split('/'));
        });
      }, storage.errorHandler);
    }
    callback();
  }

  storage.metainfo = function(filename, callback) {
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function(fs) {
        fs.root.getFile(filename, {create: false}, function(fileEntry) {
          fileEntry.getMetadata(function(meta) {
            if (callback) {
              callback(meta);
            }
          });
        });
      });
    }, storage.errorHandler);
  }

  storage.rename = function(dir, oldnm, newnm) {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5, function (bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function (fs) {
        fs.root.getDirectory(dir, {create: false}, function (entry) {
          entry.getFile(oldnm, {}, function (fileEntry) {
            fileEntry.moveTo(entry, newnm);
          });
        });
      });
    });
  };

  storage.remove = function(filename, callback) {
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes) {
      window.requestFileSystem(window.PERSISTENT, bytes, function(fs) {
        fs.root.getFile(filename, {create: false}, function(fileEntry) {
          // ファイル削除
          fileEntry.remove(function() {
            util.log('file removed:'+filename)
            if (callback) {
              callback(true);
            }
          });
        });
      });
    }, storage.errorHandler);
  }

  storage.removeRecursively = function(dir, callback) {
    window.requestFileSystem(window.PERSISTENT, 1024*1024, function(fs) {
      fs.root.getDirectory(dir, {}, function(dirEntry) {
        dirEntry.removeRecursively(function() {
          util.log('directory removed:'+dir)
          if (callback) {
            callback(true);
          }
        }, storage.errorHandler);
      }, storage.errorHandler);
    }, storage.errorHandler);
  }
})();
