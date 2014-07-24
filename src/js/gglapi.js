/**
 * Created by muhi on 2014/06/29.
 */
var gglapi = gglapi || {};
(function() {
  gglapi.CLIENT_ID = '206298929708-ak62pnmmukilom4l5idd1203tlp4ma14.apps.googleusercontent.com';
  gglapi.APIKEY = 'AIzaSyA8D71DP9GXqvrfYTAehrw1Eb8q61w3Z5g';
  gglapi.SCOPES = 'https://www.googleapis.com/auth/drive';
  gglapi.auth = false;
  /**
   * Check if the current user has authorized the application.
   */
  gglapi.checkAuth = function(callback) {
    gapi.client.setApiKey(this.APIKEY);
    gapi.auth.authorize({
        'client_id': this.CLIENT_ID,
        'scope': this.SCOPES,
        'immediate': true
      },
      callback);
  }

  /**
   * authorized
   */
  gglapi.authorize = function(callback) {
    gapi.client.setApiKey(this.APIKEY);
    gapi.auth.authorize({
        'client_id': this.CLIENT_ID,
        'scope': this.SCOPES,
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
