/**
 * Created by muhi on 2014/06/29.
 */
var gglapi = gglapi || {};
(function() {
  gglapi.auth = false;
  /**
   * Check if the current user has authorized the application.
   */
  gglapi.checkAuth = function(callback) {
    gapi.client.setApiKey(chrome.app.getDetails().oauth2.apikey);
    gapi.auth.authorize({
        'client_id': chrome.app.getDetails().oauth2.client_id,
        'scope': chrome.app.getDetails().oauth2.scopes,
        'immediate': true
      },
      callback);
  }

  /**
   * authorized
   */
  gglapi.authorize = function(callback) {
    gapi.client.setApiKey(chrome.app.getDetails().oauth2.apikey);
    gapi.auth.authorize({
        'client_id': chrome.app.getDetails().oauth2.client_id,
        'scope': chrome.app.getDetails().oauth2.scopes,
        'immediate': false
      },
      callback);
  }

  /**
   * Called when authorization server replies.
   * @param {Object} authResult Authorization result.
   */
  gglapi.handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
      this.auth = true;
    } else {
      // No access token could be retrieved, show the button to start the authorization flow.
      this.auth = false;
    }
  }
})();
/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
  window.setTimeout(function(){
    gglapi.checkAuth(gglapi.handleAuthResult);
  },100);
}
