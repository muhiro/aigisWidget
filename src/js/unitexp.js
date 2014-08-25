/**
 * Created by muhiro on 2014/08/25.
 */
var unitexp = unitexp || {};
(function() {
  var db = new aigisWidget.aigisdb();
  var exp = db.getUnitexp();

  unitexp.getMaxLevel = function(rarity, grow) {
    return exp.meta[rarity][grow];
  };

  unitexp.getAmountExp = function(rarity, level) {
    var v = 0;
    if (exp.meta[rarity].level.length > level) {
      v = exp.meta[rarity].level[Number(level) - 1];
    }
    return v;
  };

  unitexp.getNextLevelExp = function(rarity, level) {
    var v1 = 0;
    var v2 = 0;
    if (exp.meta[rarity].level.length > level) {
      v1 = exp.meta[rarity].level[Number(level) - 1];
      v2 = exp.meta[rarity].level[Number(level)];
    }
    return v2 - v1;
  };
})();
