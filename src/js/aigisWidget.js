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
    return sysdate.toLocaleString()
              +','+drop.mapid
              +','+drop.mapname
              +','+drop.star
              +','+drop.cleartime
              +strd
              +'\r\n';
  }
  aigisWidget.exportformatGacha = function(sysdate, gacha) {
    return sysdate.toLocaleString()
            +','+gacha.rarity
            +','+gacha.type
            +','+gacha.classid
            +','+gacha.classname
            +','+gacha.unitid
            +','+gacha.unitname
            +'\r\n';
  }
  aigisWidget.exportTableformatDropHeader = function() {
    return '<tr>'
      +'<th>日時</th>'
      +'<th>マップID</th>'
      +'<th>マップ名</th>'
      +'<th>★</th>'
      +'<th>クリアタイム</th>'
      +'<th>1レア</th>'+'<th>1クラスID</th>'+'<th>1クラス名</th>'+'<th>1ユニットID</th>'+'<th>1ユニット名</th>'
      +'<th>2レア</th>'+'<th>2クラスID</th>'+'<th>2クラス名</th>'+'<th>2ユニットID</th>'+'<th>2ユニット名</th>'
      +'<th>3レア</th>'+'<th>3クラスID</th>'+'<th>3クラス名</th>'+'<th>3ユニットID</th>'+'<th>3ユニット名</th>'
      +'<th>4レア</th>'+'<th>4クラスID</th>'+'<th>4クラス名</th>'+'<th>4ユニットID</th>'+'<th>4ユニット名</th>'
      +'<th>5レア</th>'+'<th>5クラスID</th>'+'<th>5クラス名</th>'+'<th>5ユニットID</th>'+'<th>5ユニット名</th>'
      +'<th>6レア</th>'+'<th>6クラスID</th>'+'<th>6クラス名</th>'+'<th>6ユニットID</th>'+'<th>6ユニット名</th>'
      +'</tr>';
  }
  aigisWidget.exportTableformatGachaHeader = function() {
    return '<tr>'
      +'<th>日時</th>'
      +'<th>レア</th>'
      +'<th>召喚タイプ</th>'
      +'<th>クラスID</th>'
      +'<th>クラス名</th>'
      +'<th>ユニットID</th>'
      +'<th>ユニット名</th>';
  }
  aigisWidget.exportTableformatDrop = function(sysdate, drop) {
    var strd = '';
    var cnt = 6;
    if (drop.drop) {
      for (var i = 0; i < drop.drop.length; i++) {
        var d = drop.drop[i];
        strd += '<td>' + d.rarity
          + '</td><td>' + d.classid
          + '</td><td>' + d.classname
          + '</td><td>' + d.unitid
          + '</td><td>' + d.unitname
          + '</td>'
        cnt -= 1;
      }
    }
    for (var i = cnt; i > 0; i--) {
      strd += '<td>　'
        + '</td><td>'
        + '</td><td>'
        + '</td><td>'
        + '</td><td>'
        + '</td>'
    }
    return '<tr>'
      +'<td>'+sysdate.toLocaleString()
      +'</td><td>'+drop.mapid
      +'</td><td>'+drop.mapname
      +'</td><td>'+drop.star
      +'</td><td>'+drop.cleartime
      +'</td>'
      +strd
      +'</tr>\r\n';
  }
  aigisWidget.exportTableformatGacha = function(sysdate, gacha) {
    return '<tr>'
      +'<td>'+sysdate.toLocaleString()
      +'</td><td>'+gacha.rarity
      +'</td><td>'+gacha.type
      +'</td><td>'+gacha.classid
      +'</td><td>'+gacha.classname
      +'</td><td>'+gacha.unitid
      +'</td><td>'+gacha.unitname
      +'</td></tr>\r\n';
  }
})();
