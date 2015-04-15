/**
 * Created by muhiro on 2014/08/24.
 */
$(function() {
  ga('send', 'pageview', window.location.toString());
  $('#rarity-black').prettyCheckable('check');
  $('#grow-cc').prettyCheckable('check');

  $(document).on('change', 'input:radio.rarity', function (eo) {
    $('.rarity-div').removeClass('rarity-select');
    $(eo.target).parent('.rarity-div').addClass('rarity-select');

    var rarity = $('input:radio.rarity:checked').val();
    if (rarity == 'silver') {
      $('#grow-awake').prettyCheckable('disable');

      var grow = $('input:radio.grow:checked').val();
      if (grow == 'awake') {
        $('#grow-cc').prettyCheckable('check');
        $('#grow-cc').change();
      }
    } else {
      $('#grow-awake').prettyCheckable('enable');
    }
    getExperienceTable();
  });

  $(document).on('change', 'input:radio.grow', function (eo) {
    $('.grow-div').removeClass('grow-select');
    $(eo.target).parent('.grow-div').addClass('grow-select');
    getExperienceTable();
  });

  $(document).on('change', '#level', function (eo) {
    $('#levelslider').slider('setValue', Number(eo.target.value));
    getExperienceTable();
  });

  $(document).on('slide', '#levelslider', function (eo) {
    $("#level").val(eo.value);
    getExperienceTable();
  });

  $(document).on('change', '#nextexp', function (eo) {
    $('#nextexpslider').slider('setValue', Number(eo.target.value));
    getExperienceTable();
  });

  $(document).on('slide', '#nextexpslider', function (eo) {
    $("#nextexp").val(eo.value);
    getExperienceTable();
  });

  $(document).on('change', '#calc', function (eo) {
    $('#experiencediff').text(($('#nowexperience').text() - Number($('#calc').val())));
  });

  var timer = false;
  function getExperienceTable() {
    $('#maxexpPlt8-icon').hide(500);
    $('#maxawkexpPlt8-icon').hide(500);
    $('#cc30expPlt8-icon').hide(500);
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      var rarity = $('input:radio.rarity:checked').val();
      var grow = $('input:radio.grow:checked').val();
      var maxLevel = unitExp.getMaxLevel(rarity, grow);
      $('#level').trigger('touchspin.updatesettings', {max: maxLevel});
      $('#levelslider').slider('setAttribute', 'max', maxLevel);
      $('#levelslider').slider('setValue', Number($("#level").val()));

      var currentLevel = $('#level').val();
      var nextexp = unitExp.getNextLevelExperience(rarity, grow, currentLevel);
      if (maxLevel == $("#level").val()) {
        $('#nextexp').trigger('touchspin.updatesettings', {max: 0});
        $('#nextexpslider').slider('setAttribute', 'max', 0);
        $('#nextexp').val(0);
        $('#nextexpslider').slider('setValue', 0);
      } else {
        $('#nextexp').trigger('touchspin.updatesettings', {max: nextexp});
        $('#nextexpslider').slider('setAttribute', 'max', nextexp);
        $('#nextexpslider').slider('setValue', Number($('#nextexp').val()));
      }

      //最大レベル
      var maxexp = unitExp.getMaxLevelExperienceNeeded(rarity, grow, $('#level').val(), $('#nextexp').val(), grow, maxLevel);
      if (maxLevel == $("#level").val()) {
        maxexp = 0;
      }
      $('#maxexperience').text(maxexp.toLocaleString());
      $('#maxexpPlt8').text(getPlatinumArmorExp(maxexp));
      getPlatinumArmorIcon($('#maxexpPlt8-icon'), getPlatinumArmorExp(maxexp));
      $('#maxexpFrm8').text(getFarmUnitExp(maxexp));
      $('#maxexpPlt8rest').text(getPlatinumArmorExpRest(maxexp));
      $('#maxexpFrm8rest').text(getFarmUnitExpRest(maxexp));

      //現在の取得済みユニット経験値
      var nlvl = 1;
      if (maxLevel == $("#level").val()) {
        nlvl = 0;
      }
      var now = Number(unitExp.getAmountOfExperience(rarity, Number($('#level').val()) + nlvl));
      $('#nowexperience').text((now - Number($('#nextexp').val())));

      $('#experiencediff').text(($('#nowexperience').text() - Number($('#calc').val())));

      //覚醒最大レベル
      var maxgrow = 'awake';
      if (rarity == 'silver') {
        maxgrow = 'cc';
      }
      var maxgrowLevel = unitExp.getMaxLevel(rarity, maxgrow);
      var maxawkexp = unitExp.getMaxLevelExperienceNeeded(rarity, grow, $('#level').val(), $('#nextexp').val(), maxgrow);
      $('#maxawakeexperience').text(maxawkexp.toLocaleString());
      $('#maxawkexpPlt8').text(getPlatinumArmorExp(maxawkexp));
      getPlatinumArmorIcon($('#maxawkexpPlt8-icon'), getPlatinumArmorExp(maxawkexp));
      $('#maxawkexpFrm8').text(getFarmUnitExp(maxawkexp));
      $('#maxawkexpPlt8rest').text(getPlatinumArmorExpRest(maxawkexp));
      $('#maxawkexpFrm8rest').text(getFarmUnitExpRest(maxawkexp));

      //30CC
      if ( (grow == 'normal') && ($('#level').val() < 30) ) {
        $('#cc30-pattern').show(500);
        var cc30exp = unitExp.getMaxLevelExperienceNeeded(rarity, grow, $('#level').val(), $('#nextexp').val(), grow, '30');
        $('#cc30experience').text(cc30exp.toLocaleString());
        $('#cc30expPlt8').text(getPlatinumArmorExp(cc30exp));
        getPlatinumArmorIcon($('#cc30expPlt8-icon'), getPlatinumArmorExp(cc30exp));
        $('#cc30expFrm8').text(getFarmUnitExp(cc30exp));
        $('#cc30expPlt8rest').text(getPlatinumArmorExpRest(cc30exp));
        $('#cc30expFrm8rest').text(getFarmUnitExpRest(cc30exp));
      } else {
        $('#cc30-pattern').hide(500);
      }
      $('#maxexpPlt8-icon').show(500);
      $('#maxawkexpPlt8-icon').show(500);
      $('#cc30expPlt8-icon').show(500);
    }, 500);
  }

  function getPlatinumArmorExp(exp) {
    return Math.floor(exp / 8000);
  }

  function getPlatinumArmorExpRest(exp) {
    return (exp % 8000);
  }

  function getPlatinumArmorIcon(obj, cnt) {
    obj.empty();
    for (var i = 0; i < cnt; i++) {
      obj.append($('<img>').attr('src', '../img/platinumarmor.png'));
    }
    return ;
  }

  function getFarmUnitExp(exp) {
    return Math.floor(exp / (698 * 8));
  }

  function getFarmUnitExpRest(exp) {
    return (exp % (698 * 8));
  }

  var inputs = $('input.prettyCheckable:not(#TestDisabled)').each(function () {
    $(this).prettyCheckable({
      labelPosition: 'right'
    });
  });

  $('.config-slider').slider().on('slide', function(eo) {
    $('#'+eo.target.id).val(eo.value).change();
  });

  $("input[name='level']").TouchSpin({
    min: 1,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10
  });

  $("input[name='nextexp']").TouchSpin({
    min: 0,
    max: 1000,
    step: 1,
    boostat: 10,
    maxboostedstep: 100
  });

  $("input[name='calc']").TouchSpin({
    min: -100000,
    max: 100000,
    verticalbuttons: true,
    step: 1
  });

  $('#rarity-black').change();
  $('#grow-cc').change();
});
