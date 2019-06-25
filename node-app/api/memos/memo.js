const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/memos/memo
  // @desc Add the memo to your "dashboard"
  // @access Private
  // @header <token>
  // @body <header> ~<content>
  router.post(
    "/memo",
    app.middlewares.loginRedirect,

    (req, res) => {
      const Memo = app.model.memo;
      const User = app.model.user;
      const { header, content } = req.body;
      const errors = {};

      if (isEmpty(header)) {
        errors.header = "Header field is required";
      }
      if (!isEmpty(errors)) {
        return res.status(400).json(errors);
      }

      User.findByToken(req.headers.token)
        .then(user => {
          if (!isEmpty(user)) {
            Memo.findOne({ header, owner: user._id })
              .then(memo => {
                if (memo) {
                  return res
                    .status(400)
                    .json({ header: "Memo with that header already exists" });
                } else {
                  const newMemo = new Memo({
                    header,
                    content,
                    owner: user._id
                  });
                  newMemo.save(err => {
                    if (err) {
                      return res.status(404).json({ reason: "Database error" });
                    } else {
                      return res.json(newMemo);
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
    }
  );
  // @path GET /api/memos/memo/
  // @desc Get memo with specific id
  // @access Private
  // @header <token>
  // @params <id>
  router.get("/memo/", app.middlewares.loginRedirect, (req, res) => {
    const Memo = app.model.memo;
    const User = app.model.user;
    const memoId = req.body.id;

    if (isEmpty(memoId)) {
      return res.status(400).json({ id: "No memo id given" });
    }
    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    User.findByToken(req.headers.token)
      .then(user => {
        if (!isEmpty(user)) {
          Memo.findOne({ owner: user._id, _id: memoId })
            .then(memo => {
              if (memo) return res.json(memo);
              else return res.status(404).json({ id: "No memo with that id" });
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
        return res.status(404).json({ reason: "Database unavailable" });
      });
  });
  // @path GET /api/memos/memo/all
  // @desc Get all memo's id's and headers
  // @access Private
  // @header <token>
  router.get("/memo/all", app.middlewares.loginRedirect, (req, res) => {
    const Memo = app.model.memo;
    const User = app.model.user;

    User.findByToken(req.headers.token)
      .then(user => {
        if (user) {
          Memo.find({ owner: user._id })
            .select("_id header")
            .then(memos => {
              console.log("Got some memos");
              if (!isEmpty(memos)) return res.json(memos);
              else
                return res
                  .status(404)
                  .json({ id: "No memos associated with your user" });
            })
            .catch(err => {
              console.log(err);
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
  return router;
};
