/**
 * Created by muhi on 2014/07/11.
 */
var settings = settings || {};
(function() {
  /**
   * localstorageに保存した設定値を取得する。
   * @returns {Store} 設定全部
   */
  settings.config = function() {
    return new Store('settings', {
      'noticeSoundVolume': 30,
      'fileNameformat': constants.defaultImageFileFormat,
      'format': 'png',
      'shortcutKey': '0',
      'noticeCaptureCompleted': true,
      'noticeMissionCompleted': true,
      'widgetResize': true
    });
  };

  if (!($('body#option').size())) { return; }
  $(window).load(function () {
//    _gaq.push(["_trackPageview"]);
    ga('send', 'pageview');

    //認証チェック
    gglapi.checkAuth(handleSettingAuthrize);

    function handleSettingAuthrize(authResult) {
      if (authResult && !authResult.error) {
        $('#googleDriveUse').disabled = false;
        $('#googleDriveAuth').addClass('disabled');
        $('#googleDriveGet').removeClass('disabled');
        $('#googleDriveList').disabled = false;
        $('#googleDriveDirectory').disabled = false;
        $('#googleDriveDirectoryID').disabled = false;
      } else {
        $('#googleDriveUse').disabled = true;
        $('#googleDriveAuth').removeClass('disabled');
        $('#googleDriveGet').addClass('disabled');
        $('#googleDriveList').disabled = true;
        $('#googleDriveDirectory').disabled = true;
        $('#googleDriveDirectoryID').disabled = true;
      }
    }

    aigisWidget.storage.read(constants.file.debugLogFile, function(entry) {
      $('#debuglog1').attr('href', entry.toURL());
    });
    aigisWidget.storage.read(constants.file.debugLogBakFile, function(entry) {
      $('#debuglog2').attr('href', entry.toURL());
    });

    $('#noticeSoundUpload').change(function () {
      var audiof = this.files[0];
      var reader = new FileReader();
      reader.onload = (function(file) {
        return function(e) {
          var audition = aigisWidget.sound.audition(e.target.result);
          bootbox.confirm("この通知音で設定しますか？", function(result) {
            audition.pause();
            if (result) {
              aigisWidget.storage.writeblob(constants.file.noticeDefaultSoundFile
                  + aigisWidget.sound.ext(file.type), file, function(result) {
                aigisWidget.sound.load(constants.file.noticeDefaultSoundFile);
                $('#noticeSoundFile').val(file.name).change();
              });
            }
          });
        };
      })(audiof);
      reader.readAsDataURL(audiof);
    });

    $('#noticeSoundFilePlay').click(function () {
      aigisWidget.sound.play(constants.file.noticeDefaultSoundFile);
    });

    $('#noticeSoundVolume').change(function () {
      aigisWidget.sound.volume();
    });

    $('#fileNameformat').change(function () {
      if ($(this).val() === '') {
        $(this).val(constants.defaultImageFileFormat);
      } else {
        $(this).val(util.filenameEscape($(this).val()));
      }
    });
    $('#googleDriveUse').change(function () {

    });
    $('#googleDriveAuth').click(function () {
      gglapi.authorize(handleSettingAuthrize);
    });

    $('#googleDriveGet').click(function () {
      $(this)
        .after(
        $('<div>')
          .attr('id', 'googleDriveGetLoading')
          .css('display', 'inline')
          .append(
          $('<img>')
            .attr('src', '../img/gif-load.gif')
          )
      )
      $('#googleDriveGet').addClass('disabled');
      $('#googleDriveList').children().remove();
      ggldrive.getDirectory(function (fileary) {
        fileary.forEach(function (entry, i) {
          $('<option>')
            .val(entry.key)
            .text(entry.value)
            .appendTo('#googleDriveList');
        });
        $('#googleDriveGet').removeClass('disabled');
        $('#googleDriveGetLoading').remove();
      });
    });

    $('#googleDriveList').change(function () {
      if ($(this).children().length > 0) {
        $('#googleDriveDirectory').val($('#' + $(this).attr('id') + ' :selected').text()).change();
        $('#googleDriveDirectoryID').val($(this).val()).change();
      }
    });

    $('#googleDriveClear').click(function () {
      $('#googleDriveDirectory').val('').change();
      $('#googleDriveDirectoryID').val('').change();
    });


    $('#cleardatabase').click(function () {
      var db = new aigisWidget.aigisdb();
      db.dropdb();
      bootbox.alert('初期化しました。');
    });
    $('#clearsettings').click(function () {
      settings.config().removeAll();
      aigisWidget.status().removeAll();
      bootbox.alert('初期化しました。');
    });

  });
})();
