/**
 * Created by muhi on 2014/07/19.
 */
var aigisWidget = aigisWidget || {};
(function () {
  var statusInvoker = aigisWidget.statusInvoker = {};
  var startQuest = null;
  var finishQuest = null;

  statusInvoker.execute = function (obj) {
    switch (obj.DA.ST) {
      case '0':   //ユニット確認？
      case '4':   //称号変更？
      case '1103'://チーム編成？
        break;
      case '1300'://startQuest
        startQuest = new Date();
        break;
      case '1301'://finishQuest
        finishQuest = new Date();
        executeFinishQuest(obj);
        break;
      case '1002'://ステータス更新要求っぽい スタミナとカリスマ？
        executeStatusUpdate(obj);
        break;
    }
  };
  function executeStatusUpdate(obj) {
    aigisWidget.status().set('money', Number(obj.DA.RT.GP.A1.V));
    aigisWidget.status().set('experience', Number(obj.DA.RT.GP.A2.V));
    aigisWidget.status().set('rank', Number(obj.DA.RT.GP.A3.V));

    var nowVitality = Number(obj.DA.RT.GP.A4.V);
    var nowStamina = Number(obj.DA.RT.GP.A5.V);
    //どっちが変わったか
    if (aigisWidget.status().get('nowVitality') != nowVitality) {
      var nowDate = new Date();
      aigisWidget.status().set('nowVitality', nowVitality);
      aigisWidget.status().set('lastmodifiedVitality', nowDate.toLocaleString());
    }
    if (aigisWidget.status().get('nowStamina') != nowStamina) {
      var nowDate = new Date();
      aigisWidget.status().set('nowStamina', nowStamina);
      aigisWidget.status().set('lastmodifiedStamina', nowDate.toLocaleString());
    }
    chrome.runtime.sendMessage({type: constants.msg.badge});
  };

  function executeFinishQuest(obj) {
    aigisWidget.notice.create(constants.notice.missionCompleted);
    var map = obj.DA.RT.LG.TT.V.split(' ');
    var ary = new Array();

    var db = new aigisWidget.aigisdb();
    var unitObj = db.getUnits().meta;
    var classObj = db.getClasses().meta;
    var mapObj = db.getMaps().meta;
    if (obj.DA.RT.PU2 === undefined) {
      //のーどろっぷ
      ary = null;
    } else {
      if (obj.DA.RT.PU2.CR.A1.V instanceof Array) {
        $.each(obj.DA.RT.PU2.CR.A1.V, function (idx, value) {
          var classid = obj.DA.RT.PU2.CR.A2.V[idx];
          var unitid = obj.DA.RT.PU2.CR.A1.V[idx];
          ary.push({
            classid: classid
            , classname: (classObj[classid] === undefined) ? null : classObj[classid].classname
            , unitid: unitid
            , unitname: (unitObj[unitid] === undefined) ? null : unitObj[unitid].unitname
            , rarity: (unitObj[unitid] === undefined) ? null : unitObj[unitid].rarity
          })
        });
      } else {
        var classid = obj.DA.RT.PU2.CR.A2.V;
        var unitid = obj.DA.RT.PU2.CR.A1.V;
        ary.push({
          classid: classid
          , classname: (classObj[classid] === undefined) ? null : classObj[classid].classname
          , unitid: unitid
          , unitname: (unitObj[unitid] === undefined) ? null : unitObj[unitid].unitname
          , rarity: (unitObj[unitid] === undefined) ? null : unitObj[unitid].rarity
        })
      }
    }
    var drop = {
      mapid: map[0]
      , mapname: (mapObj[map[0]] === undefined) ? null : mapObj[map[0]].mapname
      , star: map[1], cleartime: util.computeDuration(finishQuest - startQuest)
      , drop: ary
    };

    chrome.runtime.sendMessage({type: constants.msg.updateDrop
      , drop: drop
    });
  };
})();
