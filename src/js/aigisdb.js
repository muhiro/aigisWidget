var aigisWidget = aigisWidget || {};
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}
(function () {
  var aigisdb = aigisWidget.aigisdb = function() {};

  var db = {};
  var metaunits = '../metadata/units.json';
  var metaclasses = '../metadata/classes.json';
  var metamaps = '../metadata/maps.json';
  var DBNAME = 'aigisdb';

  var STOREDROP = 'drop';
  var STOREGACHA = 'gacha';

  var storedrop = null;
  var storegacha = null;

  aigisdb.prototype.open = function(callback) {
    var request = indexedDB.open(DBNAME, constants.dbversion);

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      var oldVersion = event.oldVersion;
      console.log('ver:'+oldVersion);
      if (oldVersion === '' || oldVersion === 0) {
        //どろっぷでーた
        storedrop = db.createObjectStore(STOREDROP, {
          autoIncrement: true
        });
        storedrop.createIndex('byTimestamp', 'timestamp')
        storedrop.createIndex('byMapid', 'mapid');

        //がちゃデータ
        storegacha = db.createObjectStore(STOREGACHA, {
          autoIncrement: true
        });
        storegacha.createIndex('byTimestamp', 'timestamp')
        storegacha.createIndex('byRarity', 'rarity');
      };
    };
    request.onsuccess = function(event) {
      //一回onupgradeneededあといonsuccessがくる
      //それまで待ってからデータを追記
      db = event.target.result;
      callback();
    };
    request.onerror = function(event) {
      console.log(event);
    };
  };

  aigisdb.prototype.getUnits = function() {
    return getJson(metaunits);
  };

  aigisdb.prototype.getClasses = function() {
    return getJson(metaclasses);
  };

  aigisdb.prototype.getMaps = function() {
    return getJson(metamaps);
  };

  function getJson(url) {
    var ret = null;
    $.ajax({
      async: false,
      type: "GET",
      scriptCharset: 'utf-8',
      dataType: 'json',
      url: url,
      success: function (data) {
        ret = data;
      },
      error: function () {
        console.log('getjson '+url+' error.');
      }
    });
    return ret;
  };

  aigisdb.prototype.putDrop = function(timestamp, mapid, mapname, star, cleartime, drop, callback) {
    var tra = db.transaction(STOREDROP, 'readwrite');
    var store = tra.objectStore(STOREDROP);

    var request = store.put({
      'timestamp': timestamp,
      'mapid': mapid,
      'mapname': mapname,
      'star': star,
      'cleartime': cleartime,
      'drop': drop
    });

    request.onsuccess = function(event) {
      console.log('put drop data:'+mapid);
      callback();
    };
    request.onerror = function(event) {
      console.log(event);
      callback();
    };
  };

  aigisdb.prototype.putGacha = function(timestamp, type, classid, classname, unitid, unitname, rarity, callback) {
    var tra = db.transaction(STOREGACHA, 'readwrite');
    var store = tra.objectStore(STOREGACHA);

    var request = store.put({
      'timestamp': timestamp,
      'type': type,
      'classid': classid,
      'classname': classname,
      'unitid': unitid,
      'unitname': unitname,
      'rarity': rarity
    });

    request.onsuccess = function(event) {
      console.log('put gacha:'+unitid);
      callback();
    };
    request.onerror = function(event) {
      console.log(event);
      callback();
    };
  };

  aigisdb.prototype.getAllDrop = function(callback) {
    var tra = db.transaction(STOREDROP, 'readonly');
    var store = tra.objectStore(STOREDROP);
    var drops = new Array();

    // Get everything in the store;
    var cursorRequest = store.index('byTimestamp').openCursor();

    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if(!!cursor == false) {
        callback(drops);
        return;
      }

      drops.push(cursor.value);
      cursor.continue();
    };
    cursorRequest.onerror = function(event) {
      console.log(event);
    };
  };

  aigisdb.prototype.getAllGacha = function(callback) {
    var tra = db.transaction(STOREGACHA, 'readonly');
    var store = tra.objectStore(STOREGACHA);
    var drops = new Array();

    // Get everything in the store;
    var cursorRequest = store.index('byTimestamp').openCursor();

    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if(!!cursor == false) {
        callback(drops);
        return;
      }

      drops.push(cursor.value);
      cursor.continue();
    };
    cursorRequest.onerror = function(event) {
      console.log(event);
    };
  };

  aigisdb.prototype.updateAllDrop = function(callback) {
    var tra = db.transaction(STOREDROP, 'readwrite');
    var store = tra.objectStore(STOREDROP);
    var drops = new Array();
    var unitObj = getJson(metaunits);
    var classObj = getJson(metaclasses);
    var mapObj = getJson(metamaps);

    // Get everything in the store;
    var cursorRequest = store.index('byTimestamp').openCursor();

    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if(!!cursor == false) {
        aigisWidget.status().set('unitsVersion', unitObj.version);
        aigisWidget.status().set('classesVersion', classObj.version);
        aigisWidget.status().set('mapsVersion', mapObj.version);
        callback(drops);
        return;
      } else {
        var data = cursor.value;
        var drops = data.drop;
        data.mapname = (mapObj.meta[data.mapid] === undefined) ? null : mapObj.meta[data.mapid].mapname
        if (drops) {
          for (var i = 0; i < drops.length; i++) {
            var drop = drops[i];
            drop.classname = (classObj.meta[drop.classid] === undefined) ? null : classObj.meta[drop.classid].classname
            drop.unitname = (unitObj.meta[drop.unitid] === undefined) ? null : unitObj.meta[drop.unitid].unitname
            drop.rarity = (unitObj.meta[drop.unitid] === undefined) ? null : unitObj.meta[drop.unitid].rarity
          }
        }
        cursor.update(data);
        cursor.continue();
      }
    };
    cursorRequest.onerror = function(event) {
      console.log(event);
    };
  };

  aigisdb.prototype.updateAllGacha = function(callback) {
    var tra = db.transaction(STOREGACHA, 'readwrite');
    var store = tra.objectStore(STOREGACHA);
    var drops = new Array();
    var unitObj = getJson(metaunits);
    var classObj = getJson(metaclasses);

    // Get everything in the store;
    var cursorRequest = store.index('byTimestamp').openCursor();

    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if(!!cursor == false) {
        aigisWidget.status().set('unitsVersion', unitObj.version);
        aigisWidget.status().set('classesVersion', classObj.version);
        callback(drops);
        return;
      } else {
        var data = cursor.value;
        data.classname = (classObj.meta[data.classid] === undefined) ? null : classObj.meta[data.classid].classname
        data.unitname = (unitObj.meta[data.unitid] === undefined) ? null : unitObj.meta[data.unitid].unitname
        data.rarity = (unitObj.meta[data.unitid] === undefined) ? null : unitObj.meta[data.unitid].rarity
        cursor.update(data);
        cursor.continue();
      }
    };
    cursorRequest.onerror = function(event) {
      console.log(event);
    };
  };

  aigisdb.prototype.close = function() {
    db.close();
  };

  aigisdb.prototype.dropdb = function(callback) {
    window.indexedDB.deleteDatabase(DBNAME);
    console.log('dropdb:'+DBNAME);
  };
})();
