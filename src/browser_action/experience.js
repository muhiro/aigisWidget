/**
 * Created by muhiro on 2014/08/24.
 */
$(function() {
  ga('send', 'pageview', window.location.toString());
  $('#rarity-black').prettyCheckable('check');
  $('#grow-awake').prettyCheckable('check');

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
  });

  $(document).on('slide', '#nextexpslider', function (eo) {
    $("#nextexp").val(eo.value);
  });

  function getExperienceTable() {
    var rarity = $('input:radio.rarity:checked').val();
    var grow = $('input:radio.grow:checked').val();
    var maxLevel = unitexp.getMaxLevel(rarity, grow);
    $("#level").trigger("touchspin.updatesettings", {max: maxLevel});
    $('#levelslider').slider('setAttribute', 'max', maxLevel);
    $('#levelslider').slider('setValue', Number($("#level").val()));

    var currentLevel = $("#level").val();
    var nextexp = unitexp.getNextLevelExp(rarity, currentLevel);
    $("#nextexp").trigger("touchspin.updatesettings", {max: nextexp});
    $('#nextexpslider').slider('setAttribute', 'max', nextexp);
    $('#nextexpslider').slider('setValue', Number($("#nextexp").val()));
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

  $('#rarity-black').change();
  $('#grow-awake').change();
});
