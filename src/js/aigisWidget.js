/**
 * Created by muhi on 2014/07/15.
 */
var aigisWidget = aigisWidget || {};
(function() {
  'use strict';
  var status = aigisWidget.status = function() {
    return new Store('status');
  };

  status.getMaxStamina = function() {
  };
  status.getMaxCharisma = function() {
  };

  aigisWidget.init = function() {
    //ユニット、クラス、マップデータのチェック
    //前回バージョンより新しければ、drop、gachaテーブルの名称を更新する
    var db = new aigisWidget.aigisdb();
    var unitObj = db.getUnits();
    var classObj = db.getClasses();
    var mapObj = db.getMaps();
    var unitUpdflg = false;
    var classUpdflg = false;
    var mapUpdflg = false;

    if (unitObj.version != aigisWidget.status().get('unitsVersion')) {
      unitUpdflg = true;
    }
    if (classObj.version != aigisWidget.status().get('classesVersion')) {
      classUpdflg = true;
    }
    if (mapObj.version != aigisWidget.status().get('mapsVersion')) {
      mapUpdflg = true;
    }
    if (unitUpdflg || classUpdflg || mapUpdflg) {
      chrome.runtime.sendMessage({type: constants.msg.updateAllDrop});
    }
    if (unitUpdflg || classUpdflg) {
      chrome.runtime.sendMessage({type: constants.msg.updateAllGacha});
    }
  };

  aigisWidget.exportformatDrop = function(sysdate, drop) {
    var strd = '';
    if (drop.drop) {
      for (var i = 0; i < drop.drop.length; i++) {
        var d = drop.drop[i];
        strd += ',' + d.rarity
          + ',' + d.classid
          + ',' + d.classname
          + ',' + d.unitid
          + ',' + d.unitname;
      }
    }
    var str = sysdate.toLocaleString()
      +','+drop.mapid
      +','+drop.mapname
      +','+drop.star
      +','+drop.cleartime
      +strd
      +'\n'
    return str;
  }
  aigisWidget.exportformatGacha = function(sysdate, gacha) {
    return sysdate.toLocaleString()
      +','+gacha.rarity
      +','+gacha.type
      +','+gacha.classid
      +','+gacha.classname
      +','+gacha.unitid
      +','+gacha.unitname
      +'\n';
  }
})();
