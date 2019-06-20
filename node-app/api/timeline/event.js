const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/timeline/event
  // @desc Add the event to your "dashboard"
  // @access Private
  // @header <token>
  // @body <header> <time> ~<content>
  router.post(
    "/event",
    app.middlewares.loginRedirect,
    app.middlewares.upload.none(),
    (req, res) => {}
  );
  // @path GET /api/timeline/event/:id
  // @desc Get event with specific id
  // @access Private
  // @header <token>
  // @params <id>
  router.get("/event/:id", app.middlewares.loginRedirect, (req, res) => {
    const Event = app.model.event;
    const User = app.model.user;
    const eventId = req.params.id;
    //TODO: Implement findByToken,
    //should return user or empty value, param: <token_str> (maybe static method in model)
    //Login.js in routes has the code, need to refactor it and separate it to model

    if (isEmpty(eventId)) {
      return res.status(400).json({ id: "No event id given" });
    }
    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    const user = User.findByToken(req.headers.token);
    if (user)
      Event.findOne({ owner: user._id })
        .then()
        .catch();
  });
  return router;
};
