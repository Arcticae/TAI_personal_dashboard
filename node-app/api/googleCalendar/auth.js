const express = require("express");
const router = express.Router();
const { oAuth2 } = require("../../utils/googleCalendarAPI");
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/googleCalendar/auth
  // @desc Post code to authorize this app to use user's calendars
  // @access Private
  // @header <token>
  // @body <accessCode>
  router.post("/", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const GoogleToken = app.model.googleToken;
    const { accessCode } = req.body;

    if (isEmpty(accessCode)) {
      return res
        .status(400)
        .json({ accessCode: "No access code provided with the request" });
    }

    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          oAuth2Client = oAuth2.oAuth2Client();
          oAuth2
            .getClientToken(oAuth2Client, accessCode)
            .then(token => {
              if (token) {
                console.log("Got the google token: " + token);
                token = JSON.stringify(token);
                newGoogleToken = new GoogleToken({
                  token,
                  owner: user._id
                });
                newGoogleToken.save(err => {
                  if (err) {
                    console.log(err);
                    return res.status(404).json({ reason: "Database error" });
                  }
                  //OK
                  return res.status(200).json({});
                });
              } else {
                return res
                  .status(404)
                  .json({ reason: "Google Token retrieval failed" });
              }
            })
            .catch(err => {
              console.log(err);
              return req.status(404).json({ reason: "Something went wrong" });
            });
        } else {
          return req.status(401).json({ reason: "Unauthorized" });
        }
      })
      .catch(err => {
        console.log(err);
        return req.status(404).json({ reason: "Database error" });
      });
  });
  // @path GET /api/googleCalendar/auth
  // @desc Get link for permission to edit google calendar
  // @access Public
  router.get("/", (req, res) => {
    const oAuth2Client = oAuth2.oAuth2Client();
    if (oAuth2Client) {
      const link = oAuth2.getAuthorizationLink(oAuth2Client);
      return res.status(404).json({ link });
    } else {
      return res
        .status(404)
        .json({ reason: "Error while creating oAuth2 client" });
    }
  });
  return router;
};
