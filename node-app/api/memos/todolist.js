const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/memos/todolist
  // @desc Add todolist to your dashboard
  // @access Private
  // @header <token>
  // @body <header> ~<content: [{ done: Boolean, content: String}]>
  router.post("/todolist", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const ToDoList = app.model.todolist;

    const { header, content } = req.body;
    const errors = {};
    if (isEmpty(header)) errors.header = "Header field is required";

    if (!content instanceof Array)
      return res
        .status(400)
        .json({ content: "Content field is not an array." });

    content.forEach(v => {
      if (!v.hasOwnProperty("done"))
        errors.done = "No done key in one of the content's elements";
      if (!v.hasOwnProperty("content"))
        errors.content = "No content key in one of the content's elements ";
    });
    //validate here and after, not to crash because of non-existing property
    if (!isEmpty(errors)) return res.status(400).json(errors);
    content.forEach(v => {
      try {
        JSON.parse(v.done);
      } catch (ex) {
        errors.done =
          "One of the done properties has invalid non-boolean value";
      }
    });
    if (!isEmpty(errors)) return res.status(400).json(errors);

    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          ToDoList.findOne({ header, owner: user._id })
            .then(list => {
              if (list) {
                return res
                  .status(400)
                  .json({ header: "ToDoList with that header already exists" });
              } else {
                const newToDoList = new ToDoList({
                  header,
                  owner: user._id,
                  content
                });
                newToDoList.save(err => {
                  if (err) {
                    return res.status(404).json({ reason: "Database error" });
                  } else {
                    return res.json(newToDoList);
                  }
                });
              }
            })
            .catch(err => {
              //validation fails here also
              console.log(err);
              return res.status(404).json({ reason: "Database error" });
            });
        } else {
          return res.status(401).json({ reason: "Unauthorized" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ reason: "Database error" });
      });
  });
  // @path PUT /api/memos/todolist
  // @desc Modify todolist with content
  // @access Private
  // @header <token>
  // @body <id> <content>
  router.put("/todolist", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const ToDoList = app.model.todolist;

    const { id, content } = req.body;
    const errors = {};

    if (!content instanceof Array)
      return res
        .status(400)
        .json({ content: "Content field is not an array." });

    content.forEach(v => {
      if (!v.hasOwnProperty("done"))
        errors.done = "No done key in one of the content's elements";
      if (!v.hasOwnProperty("content"))
        errors.content = "No content key in one of the content's elements ";
    });
    //validate here and after, not to crash because of non-existing property
    if (!isEmpty(errors)) return res.status(400).json(errors);
    content.forEach(v => {
      try {
        JSON.parse(v.done);
      } catch (ex) {
        errors.done =
          "One of the done properties has invalid non-boolean value";
      }
    });
    if (!isEmpty(errors)) return res.status(400).json(errors);
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          ToDoList.findOne({ _id: id, owner: user._id })
            .then(list => {
              if (list) {
                list.content = content;
                list.save(err => {
                  if (err) {
                    console.log(err);
                    return res.status(404).json({ reason: "Database error" });
                  } else {
                    return res.json(list);
                  }
                });
              } else {
                return res
                  .status(404)
                  .json({ id: "ToDoList with that id does not exist" });
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
  // @path GET /api/memos/todolist
  // @desc Get todolist's content
  // @access Private
  // @header <token>
  // @body <id>
  router.get("/todolist", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const ToDoList = app.model.todolist;

    const { id } = req.body;
    const errors = {};
    if (isEmpty(id)) {
      errors.id = "id field is required";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          ToDoList.findOne({ _id: id, owner: user._id })
            .then(list => {
              if (list) {
                return res.json(list);
              } else {
                return res
                  .status(404)
                  .json({ id: "ToDoList with that id does not exist" });
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
  // @path GET /api/memos/todolist/all
  // @desc Get id's and headers of all your todolists
  // @access Private
  // @header <token>
  router.get("/todolist/all", app.middlewares.loginRedirect, (req, res) => {
    const User = app.model.user;
    const ToDoList = app.model.todolist;

    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          ToDoList.find({ owner: user._id })
            .select("header _id")
            .then(list => {
              if (list) {
                return res.json(list);
              } else {
                return res.status(404).json({ id: "You have no todolists" });
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

  return router;
};
