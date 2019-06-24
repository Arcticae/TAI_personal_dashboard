const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/memos/memo
  // @desc Add the memo to your "dashboard"
  // @access Private
  // @header <token>
  // @body <header> <time> ~<content>
  router.post(
    "/memo",
    app.middlewares.loginRedirect,
    app.middlewares.upload.none(),
    (req, res) => {
      const Memo = app.model.memo;
      const header = req.body.header;
      const content = req.body.content;
      const errors = {};

      if (isEmpty(header)) {
        errors.header = "Header field is required";
      }
      if (!isEmpty(errors)) {
        return res.status(400).json(errors);
      }

      const user = User.findByToken(req.headers.token);
      if (!isEmpty(user)) {
        Memo.findOne({ header })
          .then(event => {
            if (event) {
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
    }
  );
  // @path GET /api/memos/memo/:id
  // @desc Get memo with specific id
  // @access Private
  // @header <token>
  // @params <id>
  router.get("/memo/:id", app.middlewares.loginRedirect, (req, res) => {
    const Memo = app.model.memo;
    const User = app.model.user;
    const memoId = req.params.id;

    if (isEmpty(memoId)) {
      return res.status(400).json({ id: "No memo id given" });
    }
    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    const user = User.findByToken(req.headers.token);
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
  });
  // @path GET /api/memos/memo/all
  // @desc Get all memo's id's and headers
  // @access Private
  // @header <token>
  router.get("/memo/all", app.middlewares.loginRedirect, (req, res) => {
    const Memo = app.model.memo;
    const User = app.model.user;

    if (isEmpty(req.headers.token)) {
      return res
        .status(400)
        .json({ token: "No API token provided in the headers" });
    }
    const user = User.findByToken(req.headers.token);
    if (user) {
      Memo.find({ owner: user._id }, "_id header")
        .then(memos => {
          if (!isEmpty(memos)) return res.json(memos);
          else
            return res
              .status(404)
              .json({ id: "No memos associated with your user" });
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
