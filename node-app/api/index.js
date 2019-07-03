const express = require("express");
const router = express.Router();

module.exports = app => {
  //User routes
  router.use("/user/", require("./user/login")(app));
  router.use("/user/", require("./user/register")(app));
  router.use("/user/", require("./user/logout")(app));
  //Timeline routes
  router.use("/timeline", require("./timeline/event")(app));
  router.use("/timeline", require("./timeline/reminder")(app));
  //Memo routes
  router.use("/memos", require("./memos/memo")(app));
  router.use("/memos", require("./memos/todolist")(app));
  //Google api routes
  router.use("/googleCalendar/auth", require("./googleCalendar/auth")(app));
  router.use("/googleCalendar/event", require("./googleCalendar/event")(app));

  return router;
};
