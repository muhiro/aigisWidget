/**
 * Created by muhi on 2014/07/27.
 */
$(window).load(function () {
  ga('send', 'pageview', window.location.toString());
  var table = [];
  var db = new aigisWidget.aigisdb();
  table.push(aigisWidget.exportTableformatDropHeader());
  db.open(function() {
    db.getAllDrop(function(drops) {
      if(drops.length < 1) {
        db.close();
        $('#result')[0].innerHTML = table.join("");
        return;
      }
      util.asynceach(drops, function(drop) {
        var deferred = new $.Deferred;
        table.push(aigisWidget.exportTableformatDrop(new Date(drop.timestamp), drop));
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
