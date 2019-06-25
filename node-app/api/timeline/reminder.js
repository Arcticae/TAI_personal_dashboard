const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/timeline/reminder/
  // @desc Add list of dates (reminders), and binds it to an event optionally
  // @access Private
  // @header <token>
  // @body <content:[{Date,String}]> ~<eventId>
  router.post("/reminder", app.middlewares.loginRedirect, (req, res) => {
    const Reminder = app.model.reminder;
    const User = app.model.user;
    const Event = app.model.event;

    const { eventId, content } = req.body;

    const errors = {};

    if (isEmpty(content)) {
      errors.content = "Content field is required";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }
    if (!content instanceof Array) {
      errors.content =
        "Content field needs to be array of entries date: <Date>, content:<String>  ";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }
    content.forEach(v => {
      if (!v.hasOwnProperty("date"))
        errors.date = "Missing date property in one of the entries";

      if (!v.hasOwnProperty("content"))
        errors.date = "Missing content property in one of the entries";
    });

    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }

    User.findByToken(req.headers.token)
      .then(user => {
        reminders = content.map(v => {
          time = Date.parse(v.date);
          if (!(time === NaN)) {
            return { ...v, date: new Date(time) };
          } else {
            errors.content = "Invalid format of one of dates";
          }
        });
        if (!isEmpty(errors)) return res.status(400).json(errors);
        reminders = reminders.map(
          v =>
            new Reminder({
              date: v.date,
              content: v.content,
              owner: user._id
            })
        );

        for (reminder of reminders) {
          reminder.save(error => {
            if (error) {
              console.log(error);
              return res.status(404).json({ reason: "Database error" });
            }
          });
        }

        if (!isEmpty(eventId)) {
          //Bind to event
          const reminders_ids = reminders.map(rem => rem._id);
          console.log(reminders_ids);
          Event.findOne({ _id: eventId, owner: user._id })
            .then(event => {
              event.reminders.push(...reminders_ids);
              console.log(event);
              event.save(error => {
                if (error) {
                  console.log(error);
                  return res.status(404).json({ reason: "Database error" });
                } else {
                  return res.json(reminders);
                }
              });
            })
            .catch(err => {
              console.log(err);
              return res.status(404).json({ reason: "Database error" });
            });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Database error" });
      });
  });
  // @path GET /api/timeline/event/reminder
  // @desc Get all event's reminders
  // @access Private
  // @header <token>
  // @body <event_id>
  router.get("/event/reminder", app.middlewares.loginRedirect, (req, res) => {
    const Event = app.model.event;
    const User = app.model.user;
    const eventId = req.body.id;

    if (isEmpty(eventId)) {
      return res.status(400).json({ id: "No event id given" });
    }

    User.findByToken(req.headers.token)
      .then(user => {
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
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Database error" });
      });
  });
  // @path GET /api/timeline/reminder/all
  // @desc Get all user's reminders
  // @access Private
  // @header <token>
  router.get("/reminder/all", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const Reminder = app.model.reminder;

    User.findByToken(req.headers.token)
      .then(user => {
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
      })
      .catch(err => {
        console.log(err);
        return req.status(404).json({ reason: "Database error" });
      });
  });
  return router;
};
