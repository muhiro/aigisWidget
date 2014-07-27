/**
 * Created by muhi on 2014/07/27.
 */
$(window).load(function () {
  var table = [];
  var db = new aigisWidget.aigisdb();
  table.push(aigisWidget.exportTableformatGachaHeader());
  db.open(function () {
    db.getAllGacha(function (gachas) {
      if(gachas.length < 1) {
        db.close();
        $('#result')[0].innerHTML = table.join("");
        return;
      }
      util.asynceach(gachas, function(gacha) {
        var deferred = new $.Deferred;
        table.push(aigisWidget.exportTableformatGacha(new Date(gacha.timestamp), gacha));
        deferred.resolve();
        return deferred.promise();
      }, function() {
        //終了処理
        db.close();
        $('#result')[0].innerHTML = table.join("");
      });
    });
  });
});
