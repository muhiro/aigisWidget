/**
 * Created by muhi on 2014/07/19.
 */
var aigisWidget = aigisWidget || {};
(function () {
  var finishInvoker = aigisWidget.finishInvoker = {};

  finishInvoker.execute = function (obj) {
    //一応DA.TG.VにfinishQuestがある事を確認した上で
    //<DA><UI T="I"><V>11240883</V></UI><UK T="S"><V>1406452073010</V></UK><TG T="S"><V>finishQuest</V></TG><TT T="S"><V>1101,0</V></TT></DA>
    if (obj.DA.TG.V == 'finishQuest') {
      executeFinishQuest(obj);
    }

  };
  function executeFinishQuest(obj) {
    aigisWidget.notice.create(constants.notice.missionCompleted);
    var map = obj.DA.TT.V.split(',');
    var ary = new Array();

    var db = new aigisWidget.aigisdb();
    var mapObj = db.getMaps().meta;
    ary = null;
    var drop = {
      mapid: map[0]
      , mapname: (mapObj[map[0]] === undefined) ? null : mapObj[map[0]].mapname
      , star: map[1], cleartime: util.computeDuration(0)
      , drop: ary
    };

    chrome.runtime.sendMessage({type: constants.msg.updateDrop
      , drop: drop
    });
  };
})();
