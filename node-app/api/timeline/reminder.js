const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/timeline/reminder/
  // @desc Add list of CSV date-reminders, and binds it to an event optionally
  // @access Private
  // @header <token>
  // @body <times>
  // @params ~<eventId>
  // @other Date-Time CSV format used on backend: yyyy-mm-dd h:min:00.0 GMT,yyyy-mm-dd h:min:00.0 GMT etc..
  //TODO: test failures in this
  router.post(
    "/reminder/(eventId=:id)?",
    app.middlewares.loginRedirect,
    app.middlewares.upload.none(),
    (req, res) => {
      const Reminder = app.model.reminder;
      const User = app.model.user;

      const eventId = req.params.id;
      const times = req.body.times;

      const errors = {};

      if (isEmpty(times)) {
        errors.times = "Times field is required";
      }

      if (!isEmpty(errors)) {
        return res.status(400).json(errors);
      }

      const owner = User.findByToken(req.headers.token);
      if (isEmpty(owner)) {
        return res.status(401).json({ reason: "Unauthorized" });
      }

      reminders = times
        .split(",")
        .map(v => {
          time = Date.parse(v);
          if (!isNan(time)) {
            return new Date(time);
          } else {
            errors.times = "Invalid format of one of dates";
            res.status(400).json(errors);
          }
        })
        .map(date => {
          newReminder = new Reminder({
            date,
            owner: owner._id
          });
        })
        .forEach(reminder => {
          reminder.save(error => {
            if (error) {
              return res.status(404).json({ reason: "Database error" });
            }
          });
        });

      if (!isEmpty(eventId)) {
        //Bind to event
        Event.findOneAndUpdate(
          { _id: eventId, owner: owner._id },
          { $push: { reminders: reminders.map(rem => rem._id) } },
          error => {
            if (error) {
              return res.status(404).json({ reason: "Database error" });
            } else {
              return res.json(reminders);
            }
          }
        );
      }

      return res.json(reminders);
    }
  );
  // @path GET /api/timeline/event/:id/reminder
  // @desc Get all event's reminders
  // @access Private
  // @header <token>
  // @params <event_id>
  router.get(
    "/event/:id/reminder",
    app.middlewares.loginRedirect,
    (req, res) => {
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
      const user = User.findByToken(req.headers.token);
      if (user) {
        Event.findOne({ owner: user._id, _id: eventId })
          .populate({
            path: "reminders"
          })
          .then(event => {
            if (event) return res.json({ reminders: event.reminders });
            else return res.status(404).json({ id: "No event with that id" });
          })
          .catch(() => {
            return res.status(404).json({ reason: "Database unavailable" });
          });
      } else {
        return req.status(401).json({ reason: "Unauthorized" });
      }
    }
  );
  // @path GET /api/timeline/reminder
  // @desc Get all user's reminders
  // @access Private
  // @header <token>
  // @params <id>
  router.get("/reminder/all", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const Reminder = app.model.reminder;
    const eventId = req.params.id;

    if (isEmpty(eventId)) {
      return res.status(400).json({ id: "No event id given" });
    }
    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    const user = User.findByToken(req.headers.token);
    if (user) {
      Reminder.find({ owner: user._id })
        .then(reminders => {
          //TODO: Test if reminders returned is an array or an object
          return res.json({ reminders });
        })
        .catch(() => {
          return res.status(404).json({ reason: "Database unavailable" });
        });
    } else {
      return req.status(401).json({ reason: "Unauthorized" });
    }
  });
  return router;
};
