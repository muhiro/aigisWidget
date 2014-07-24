/**
 * Created by muhiro on 2014/07/07.
 */
var message = message || {};
(function() {
  if ($.ajax) {
    $.ajax({
      type: "GET",
      scriptCharset: 'utf-8',
      dataType: 'json',
      url: '../js/message.json',
      success: function (json) {
        message.fm = $.extend(true, {}, json);
        //
        //      if (null == json || "object" != typeof json) return json;
        //      this.message = json.constructor();
        //      for (var attr in json) {
        //        if (json.hasOwnProperty(attr)) this.message[attr] = json[attr];
        //      }
      },
      error: function () {
        console.log('error.');
      }
    });
  };
})();
