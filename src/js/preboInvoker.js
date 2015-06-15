/**
 * Created by muhi on 2015/05/22.
 */
var aigisWidget = aigisWidget || {};
(function() {
  var preboInvoker = aigisWidget.preboInvoker = {};
  var gachatype = '';

  preboInvoker.execute = function(obj) {
    util.log('aaa');

    //var xhr = new XMLHttpRequest();
    //var url = 'https://all.millennium-war.net/zzdfsknw';
    //var responseText = '';
    //
    //xhr.open('POST', url, true);
    //xhr.onreadystatechange = function () {
    //  if (xhr.readyState === 4 && xhr.status === 200) {
    //    responseText = xhr.responseText;
    //    util.log(responseText);
    //  }
    //};
    //xhr.send('<DA><UI>11240883</UI><UK>1432234874840</UK></DA>');
  };
  function executePreboLoader(obj) {
    var classid = obj.DA.RT.PU2.CR.A2.V;
    var unitid = obj.DA.RT.PU2.CR.A1.V;
    var db = new aigisWidget.aigisdb();
    var unitObj = db.getUnits().meta;
    var classObj = db.getClasses().meta;
    var gachaname = '';
    if (gachatype == '0') {
      gachaname = 'ベース召喚';
    } else if (gachatype == '1') {
      gachaname = 'プレミアム召喚';
    } else if (gachatype == '2') {
      gachaname = 'レア召喚';
    }
    var gacha = {
      type: gachaname
      ,classid: classid
      ,classname: (classObj[classid] === undefined)? null: classObj[classid].classname
      ,unitid: unitid
      ,unitname: (unitObj[unitid] === undefined)? null: unitObj[unitid].unitname
      ,rarity: (unitObj[unitid] === undefined)? null: unitObj[unitid].rarity
    }
    chrome.runtime.sendMessage({type: constants.msg.updateGacha
      ,gacha: gacha
    });
  };
})();
