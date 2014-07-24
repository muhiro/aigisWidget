/**
 * Created by muhi on 2014/07/19.
 */
var aigisWidget = aigisWidget || {};
(function() {
  var statusInvoker = aigisWidget.gachaInvoker = {};
  var gachatype = '';

  statusInvoker.execute = function(obj) {
    switch(obj.DA.ST) {
      case '1100'://ガチャ結果
        executeGachaUpdate(obj);
        break;
      case '1200'://ガチャ宣告
        gachatype = obj.DA.RT.GA.GT.V
        break;
    }
  };
  function executeGachaUpdate(obj) {
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
