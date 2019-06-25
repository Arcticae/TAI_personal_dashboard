const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/timeline/event
  // @desc Add the event to your "dashboard"
  // @access Private
  // @header <token>
  // @body <header> <time> ~<content>
  // @other Date-Time format used on backend: yyyy-mm-dd h:min:00.0 GMT
  router.post("/event", app.middlewares.loginRedirect, (req, res) => {
    const Event = app.model.event;
    const header = req.body.header;
    const time = req.body.time;
    const content = req.body.content;
    const errors = {};

    if (isEmpty(header)) {
      errors.header = "Header field is required";
    }
    if (isEmpty(time)) {
      errors.time = "Event time field is required";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          Event.findOne({ header })
            .then(event => {
              if (event) {
                return res
                  .status(400)
                  .json({ header: "Event with that header already exists" });
              } else {
                const newEvent = new Event({
                  header,
                  content,
                  time: Date.new(Date.parse(time)),
                  owner: user._id
                });
                newEvent.save(err => {
                  if (err) {
                    return res.status(404).json({ reason: "Database error" });
                  } else {
                    return res.json(newEvent);
                  }
                });
              }
            })
            .catch(() => {
              return res.status(404).json({ reason: "Database error" });
            });
        } else {
          return res.status(401).json({ reason: "Unauthorized" });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Database error" });
      });
  });
  // @path GET /api/timeline/event/:id
  // @desc Get event with specific id
  // @access Private
  // @header <token>
  // @params <id>
  router.get("/event/:id", app.middlewares.loginRedirect, (req, res) => {
    const Event = app.model.event;
    const User = app.model.user;
    const eventId = req.params.id;

    if (isEmpty(eventId)) {
      return res.status(400).json({ id: "No event id given" });
    }
    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          Event.findOne({ owner: user._id, _id: eventId })
            .populate({
              path: "reminders"
            })
            .then(event => {
              if (event) return res.json(event);
              else return res.status(404).json({ id: "No event with that id" });
            })
            .catch(() => {
              return res.status(404).json({ reason: "Database unavailable" });
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
  // @path GET /api/timeline/event/all
  // @desc Get all event's id's and headers
  // @access Private
  // @header <token>
  router.get("/event/all", app.middlewares.loginRedirect, (req, res) => {
    const Event = app.model.event;
    const User = app.model.user;

    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (user) {
          Event.find({ owner: user._id }, "_id header")
            .then(events => {
              if (!isEmpty(events)) return res.json(events);
              else
                return res
                  .status(404)
                  .json({ id: "No events associated with your user" });
            })
            .catch(() => {
              return res.status(404).json({ reason: "Database unavailable" });
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
