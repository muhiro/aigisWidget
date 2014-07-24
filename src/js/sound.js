var aigisWidget = aigisWidget || {};
(function() {
  'use strict';
  var sound = aigisWidget.sound = function() {};

  // あらかじめ読み込んでおく
  sound.audiolist = {};
  aigisWidget.storage.findReaddataurl(constants.file.noticeDefaultSoundFile+'.*', function(data) {
    sound.audiolist[constants.file.noticeDefaultSoundFile] = new Audio(data);
    sound.audiolist[constants.file.noticeDefaultSoundFile].volume = settings.config().get('noticeSoundVolume')/100
  });

  sound.ext = function (mime) {
    var ext = "";
    if (mime == 'audio/ogg') {
      ext = ".ogg";
    }
    else if (mime == 'audio/mp3') {
      ext = ".mp3";
    }
    else if (mime == 'audio/wav') {
      ext = ".wav";
    }
    return ext;
  }

  sound.load = function(id, callback) {
    aigisWidget.storage.findReaddataurl(id+'.*', function(data) {
      sound.audiolist[id] = new Audio(data);
      sound.audiolist[id].volume = settings.config().get('noticeSoundVolume')/100;
      if (callback) {
        callback();
      }
    });
  }
  sound.audition = function(data) {
    var audio = new Audio(data);
    audio.volume = settings.config().get('noticeSoundVolume')/100;
    audio.play();
    return audio;
  }
  sound.play = function(id) {
    //sound.audiolist[id].pause();
    sound.audiolist[id].load();
    sound.audiolist[id].volume = settings.config().get('noticeSoundVolume')/100;
    sound.audiolist[id].play();
    //制御がめんどくさいから先読みしない
    //sound.load(id);
  }
  sound.stop = function(id) {
    sound.audiolist[id].pause();
  }
  /**
   * 100で
   * @param vol
   */
  sound.volume = function() {
    $.each(sound.audiolist, function(key, value) {
      value.volume = settings.config().get('noticeSoundVolume')/100;
    });
  }
})();
