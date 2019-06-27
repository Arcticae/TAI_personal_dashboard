//add your models here
module.exports = app => {
  const user = require("./auth/users")(app);
  const token = require("./auth/tokens")(app);
  const memo = require("./memos/memo")(app);
  const todolist = require("./memos/todolist")(app);
  const event = require("./timeline/event")(app);
  const reminder = require("./timeline/reminder")(app);

  return {
    //auth
    user,
    token,
    //memo
    memo,
    todolist,
    //timeline
    event,
    reminder
  };
};
