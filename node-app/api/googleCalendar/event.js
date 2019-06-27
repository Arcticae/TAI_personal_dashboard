const express = require("express");
const router = express.Router();
const { oAuth2, fetchEvents } = require("../../utils/googleCalendarAPI");
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path GET /api/googleCalendar/event/all
  // @desc Get all event's from user's calendar
  // @access Private
  // @header <token>
  router.post("/", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const GoogleToken = app.model.googleToken;

    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          //find user's google token
          GoogleToken.findOne({ owner: user._id })
            .then(googleToken => {
              const oAuth2Client = oAuth2.oAuth2Client();
              //Authorize the client with google
              googleToken = JSON.parse(googleToken);
              oAuth2.authorizeClient(oAuth2Client, googleToken);
              fetchEvents(oAuth2Client)
                .then(events => {
                  return res.json(events);
                })
                .catch(err => {
                  console.log(err);
                  return res.status(404).json({ reason: "Not found" });
                });
            })
            .catch(err => {
              console.log(err);
              return req.status(404).json({ reason: "Database error" });
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

  return router;
};
