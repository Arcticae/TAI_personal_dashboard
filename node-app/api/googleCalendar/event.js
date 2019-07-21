const express = require("express");
const router = express.Router();
const { oAuth2, fetchEvents } = require("../../utils/googleCalendarAPI");
const isEmpty = require("../../utils").params.isEmpty;

module.exports = app => {
  // @path GET /api/googleCalendar/event/
  // @desc Get "ahead" of events from user's calendar
  // @access Private
  // @header <token>
  // @body <ahead>
  // Response: [{ header: <String> , date: <Date> , reminders: [ <Date> ] }]
  router.get("/", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const GoogleToken = app.model.googleToken;
    let { ahead } = req.body;

    if (isEmpty(ahead)) {
      return res.status(400).json({ ahead: "No ahead parameter in body" });
    }
    ahead = parseInt(ahead);
    console.log(ahead);
    if (Number.isNaN(ahead) || ahead < 0) {
      return res
        .status(400)
        .json({ ahead: "Ahead param must be a positive integer" });
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          //find user's google token
          GoogleToken.findOne({ owner: user._id })
            .then(googleToken => {
              if (googleToken) {
                const oAuth2Client = oAuth2.oAuth2Client();
                oAuth2.authorizeClient(oAuth2Client, googleToken.token);
                fetchEvents(oAuth2Client, ahead)
                  .then(events => {
                    if (!isEmpty(events)) return res.json(events);
                    else {
                      return res.status(404).json({
                        reason: "No events associated with your account found"
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    return res.status(404).json({ reason: "Not found" });
                  });
              } else {
                return res
                  .status(401)
                  .json({ unauthorized: "Google token not found" });
              }
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
