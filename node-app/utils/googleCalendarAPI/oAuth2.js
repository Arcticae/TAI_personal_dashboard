const { google } = require("googleapis");
const fs = require("fs");
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
//Function used to create oAuth2 client
const oAuth2Client = () => {
  //Load client credentials
  let credentials;
  try {
    //TODO: Store this somewhere in db or more securely than in fs
    credentials = fs
      .readFileSync("./utils/googleCalendarAPI/credentials.json")
      .toString();
    credentials = JSON.parse(credentials);
  } catch (ex) {
    console.log("Error loading client secret file: " + ex);
    return null;
  }
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return oAuth2Client;
};

//function returns authorization links for user,
//based on oAuth2Client object in param
const getAuthorizationLink = oAuth2Client =>
  oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

//Authorize client based on code returned from user's input
// Returns promise
const getClientToken = async (oAuth2Client, accessCode) => {
  return await oAuth2Client.getToken(accessCode);
};
//Authorize client with token
const authorizeClient = (oAuth2Client, googleToken) => {
  oAuth2Client.setCredentials(googleToken);
  return oAuth2Client;
};

//Flow:
// -> Ask user for code with auth link
// -> provide code and retrieve the token
// -> get oauth2 client based on retrieved token
module.exports = {
  oAuth2Client,
  getAuthorizationLink,
  getClientToken,
  authorizeClient
};
