/**
 * Created by muhi on 2014/07/06.
 */
$(function () {
  var tabs = {};
  var config = settings.config();

  if (manifest.icon == undefined) {
    $('<i>')
      .addClass('glyphicon glyphicon-cog')
      .css('font-size', '3em')
      .append($('<h1>')
        .text(manifest.name)
    ).appendTo('#header');
    document.title = manifest.name;
  } else {
    $('#header')
      .append($('<img>')
        .attr('src', 'icon.png')
      )
      .append($('<h1>')
        .text(manifest.name)
    );
    document.title = manifest.name;
  }

  $.each(manifest.settings, function (idx, params) {
    var tab;
    //console.log(JSON.stringify(params));
    if (tabs[params.tab] === undefined) {
      tabs[params.tab] = {};
    }
    tab = tabs[params.tab];

    if (tab[params.group] === undefined) {
      tab[params.group] = {};
    }
    var group = tab[params.group];
    group[params.name] = {};
    var item = group[params.name];
    item.id = params.id;
    if (params.id == undefined) {
      item.id = params.name;
    }
    item.name = params.name;
    item.label = params.label;
    item.type =  params.type.toLowerCase();
    item.value = params.value;
    item.text = params.text;
    item.readonly = Boolean(params.readonly);
    if (item.type == 'radiobuttons'
      || item.type == 'listbox') {
      item.options = [];
      $.each(params.options, function (oidx, oparams) {
        var option = {};
        option.value = oparams.value;
        option.label = oparams.text;
        if (oparams.default != undefined) {
          option.default = oparams.default;
        }
        item.options.push(option);
      });
    }
    if (item.type == 'button-text') {
      item.button = {};
      item.button.name = params.button.name;
      item.button.id = params.button.id;
      if (params.button.id == undefined) {
        item.button.id = params.button.name;
      }
      item.button.text = params.button.text;
    }
  });

  $.each(tabs, function (tidx, tab) {
    $('<a>')
      .attr('href', '#'+tidx)
      .addClass('sidebar-anchor')
      .addClass('list-group-item')
      .append($('<h4>')
        .addClass('list-group-item-heading')
        .text(tidx)
      ).appendTo('#sidebar')

    $('<div>').addClass('page-header')
      .append($('<a>').attr('name', tidx))
      .append($('<h1>').text(tidx))
      .appendTo('#content');
    var d = $('<div>').addClass('well bs-component');
    var f = $('<form>').addClass('form-horizontal');
    var elem = $('<fieldset>');

    $.each(tab, function (gidx, group) {
      var g = $('<legend>').text(gidx);
      elem.append(g);

      $.each(group, function (iidx, item) {
        elem.append();

        var ctlgroup = $('<div>').addClass('form-group');
        switch (item.type) {
          case 'radiobuttons':
          case 'slider':
            $('<label>').addClass('control-label').addClass('col-sm-3').text(item.label).appendTo(ctlgroup);
            break;
          default:
            $('<label>').addClass('control-label').addClass('col-sm-3').appendTo(ctlgroup);
            break;
        }

        var value = '';
        if (config.get(item.id)) {
          value = config.get(item.id);
        }
        //console.log(item.id+':'+value);

        var ctl = $('<div>').addClass('controls').addClass('col-sm-8');
        switch (item.type) {
          case 'a':
            if (item.label) {
              var d1 = $('<div>')
                .addClass('panel-body');
              var d2 = $('<div>')
                .addClass('panel panel-default');

              var a = $('<a>')
                .attr('id', item.id)
                .attr('href', item.label)
                .attr('target', '_blank')
                .text(item.text)
              a.appendTo(d1);
              d1.appendTo(d2);
              d2.appendTo(ctl);
            }
            break;
          case 'text':
            $('<label>')
              .text(item.label)
              .appendTo(ctl);
            var tag = $('<input>')
              .attr('type', 'text')
              .addClass('form-control')
              .attr('id', item.id)
              .val(value);
            if (item.readonly) {
              tag.attr('readonly', item.readonly)
            }
            ctlgroup.addClass('has-warning');
            tag.appendTo(ctl);
            break;
          case 'checkbox':
            $('<input>')
              .attr('type', 'checkbox')
              .attr('name', item.name)
              .attr('id', item.id)
              .addClass('prettyCheckable')
              .addClass('form-control')
              .attr('value', item.value)
              .attr('data-label', item.label)
              .prop('checked', value)
              .appendTo(ctl);
            if (item.text) {
              $('<div class="alert alert-dismissable alert-danger">' + item.text + '</div>')
                .appendTo(ctl);
            }
            break;
          case 'radiobuttons':
            $.each(item.options, function (idx, params) {
              var rb = $('<input>')
                .attr('type', 'radio')
                .attr('name', item.name)
                .addClass('prettyCheckable')
                .addClass('form-control')
                .attr('value', params.value)
                .attr('data-label', params.label)
              if (params.value == value) {
                rb.prop('checked', true);
              }
              rb.appendTo(ctl);
              ctl.append('<br>')
            });
            break;
          case 'description':
            $('<div class="alert alert-dismissable alert-danger">'+item.text+'</div>')
              .appendTo(ctl);
            break;
          case 'button-default':
            if (item.label) {
              var d1 = $('<div>')
                .addClass('panel-body')
                .text(item.label);
              var d2 = $('<div>')
                .addClass('panel panel-default');
              d1.appendTo(d2);
              d2.appendTo(ctl);
            }
            $('<input>')
              .attr('type', 'button')
              .attr('id', item.id)
              .addClass('btn btn-default')
              .attr('value', item.text)
              .appendTo(ctl);
            break;
          case 'button-primary':
            if (item.label) {
              var d1 = $('<div>')
                .addClass('panel-body')
                .text(item.label);
              var d2 = $('<div>')
                .addClass('panel panel-default');
              d1.appendTo(d2);
              d2.appendTo(ctl);
            }
            $('<input>')
              .attr('type', 'button')
              .attr('id', item.id)
              .addClass('btn btn-primary')
              .attr('value', item.text)
              .appendTo(ctl);
            break;
          case 'button-text':
            var tag = $('<div>')
              .addClass('input-group');
            $('<span>')
              .addClass('input-group-addon')
              .text(item.label)
              .appendTo(tag);
            var t = $('<input>')
              .attr('type', 'text')
              .attr('id', item.id)
              .addClass('form-control')
              .val(value);
            if (item.readonly) {
              t.attr('readonly', item.readonly);
            }
            t.appendTo(tag);
            $('<span>')
              .addClass('input-group-btn')
              .append($('<button>')
                .attr('type', 'button')
                .attr('id', item.button.id)
                .addClass('btn btn-default')
                .text(item.button.text)
              ).appendTo(tag);
            tag.appendTo(ctl);
            break;
          case 'listbox':
            if (item.label) {
              var d1 = $('<div>')
                .addClass('panel-body')
                .text(item.label);
              var d2 = $('<div>')
                .addClass('panel panel-default');
              d1.appendTo(d2);
              d2.appendTo(ctl);
            }
            var s = $('<select>')
              .attr('name', item.name)
              .attr('id', item.id)
              .attr('size', 10)
              .addClass('form-control');
            $.each(item.options, function (idx, params) {
              var lb = $('<option>')
                .attr('value', params.value)
                .text(params.label);
              if (params.value == value) {
                lb.prop('checked', true);
              }
              lb.appendTo(s);
            });
            ctl.append(s);
            break;
          case 'file':
            if (item.label) {
              $('<div>')
                .addClass('panel-body')
                .appendTo('<div>')
                .addClass('panel panel-default')
                .text(item.label)
                .appendTo(ctl);
            }
            $('<input>')
              .attr('id', item.id)
              .attr('type', 'file')
              .attr('name', item.name)
              .appendTo(ctl);
            break;
          case 'slider':
            $('<input>')
              .attr('id', item.id)
              .attr('type', 'text')
              .addClass('config-slider')
              .attr('data-slider-id', item.id)
              .attr('data-slider-min', '0')
              .attr('data-slider-max', '100')
              .attr('data-slider-step', '1')
              .attr('data-slider-value', value)
              .val(value)
              .appendTo(ctl);
            if (item.text) {
              $('<div>')
                .append($('<label>')
                  .text(item.text)
              ).appendTo(ctl);
            }
            break;
          default:
            $('<div>')
              .text('_')
              .appendTo(ctl);
            break;
        }
        ctlgroup.append(ctl);
        elem.append(ctlgroup);
      });
    });
    f.append(elem);
    d.append(f);
    $('#content').append(d);
  });

  var inputs = $('input.prettyCheckable:not(#TestDisabled)').each(function () {
    $(this).prettyCheckable({
      labelPosition: 'right'
    });
  });

  //各要素の高さ
  var sidebarObj = $('#sidebar');
  var offset = $(sidebarObj).offset();
  var topPadding = parseInt($(sidebarObj).css('padding-top'), 10);
  $(window).scroll(function() {
    if ($('#sidebar').offset().left != $('#content').offset().left) {
      if ($(window).scrollTop() > offset.top) {
        $(sidebarObj).stop().animate({
          duration: 'fast',
          marginTop: $(window).scrollTop() - offset.top + topPadding
        });
      } else {
        $(sidebarObj).stop().animate({
          marginTop: 0
        });
      }
    } else {
      $(sidebarObj).stop().animate({
        marginTop: 0
      });
    }
  });

  $(document).on('submit', 'form', function (eo) {
    return false;
  });
  $(document).on('change', 'select', function (eo) {
    config.set(eo.target.id, eo.target.value);
  });
  $(document).on('change', 'input:checkbox', function (eo) {
    config.set(eo.target.id, $('#'+eo.target.id).prop('checked'));
  });
  $(document).on('change', 'input:radio', function (eo) {
    config.set(eo.target.name, eo.target.value);
  });
  $(document).on('change', 'input:text', function (eo) {
    if (eo.target.value === '') {
      config.remove(eo.target.id);
    } else {
      config.set(eo.target.id, eo.target.value);
    }
  });
  $('.config-slider').slider().on('slide', function(eo) {
    config.set(eo.target.id, eo.value);
    $('#'+eo.target.id).val(eo.value).change();
  });
});
