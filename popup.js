$(document).ready(function () {
  // Client ID and API key from the Developer Console
  var CLIENT_ID =
    "1003486520422-t6spjego4lt0disllmnricj4dgrdsvku.apps.googleusercontent.com";
  var API_KEY = "AIzaSyDkG1qwxGIxFtm4dLRTFvDz1QVkqiHFglk";

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/gmail.send";

  // Initialize the API client library and set up sign-in state listeners.
  function handleClientLoad() {
    gapi.load("client:auth2", initClient);
  }
  function initClient() {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        plugin_name: "Tracking",
      })
      .then(function() {
        // Authenticate the user with their Google account credentials
        gapi.auth2.getAuthInstance().signIn();
      })
      .then(function () {
        // Listen for form submit event
        $("#send-email-form").submit(function (event) {
          event.preventDefault();

          // Get form values
          var to = $("#to").val();
          var subject = $("#subject").val();
          var message = $("#message").val();

          // Call Gmail API to send email
          // var email = "To: " + to + "\r\n" +
          //             "Subject: " + subject + "\r\n\r\n" +
          //             message;
          var email =
            "To: " +
            to +
            "\r\n" +
            "Subject: " +
            subject +
            "\r\n" +
            'Content-Type: text/html; charset="UTF-8"\r\n\r\n' +
            message +
            '<img src="http://localhost:3000/?to=' +
            to +
            "&subject=" +
            encodeURIComponent(subject) +
            "&time=" +
            new Date().getTime() +
            '" height="1" width="1">';

          console.log(email, "fdgdfgfdgd");
          var base64EncodedEmail = btoa(email);
          var request = gapi.client.gmail.users.messages.send({
            userId: "me",
            resource: {
              raw: base64EncodedEmail,
            },
          });

          request.execute(function (response) {
            console.log(response);
            alert("Email sent successfully.");
          });
        });
      });
  }

  handleClientLoad();
});
