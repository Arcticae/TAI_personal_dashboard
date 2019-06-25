const express = require("express");
const router = express.Router();
const utils = require("../../utils");
const isEmpty = utils.params.isEmpty;
const hashToken = utils.security.hashToken;

module.exports = app => {
  const Token = app.model.token;
  const User = app.model.user;

  // @path POST /api/user/login
  // @desc Log in the user and retrieve the token
  // @access Public
  // @body <email> <password>
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    errors = {};
    //TODO: move validation to other file and validate format of e-mail (or just use HTML5)
    if (isEmpty(email)) {
      errors.email = "E-Mail field cannot be empty";
    }
    if (isEmpty(password)) {
      errors.password = "Password field cannot be empty";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: email }).exec((err, user) => {
      if (err) {
        return res.status(404).json({
          reason: "Database user search error"
        });
      } else if (user) {
        if (user.password === password) {
          let token = hashToken(16);
          let timeout = app.config.SESS_TIMEOUT * 60000;
          let validTo = new Date(Date.now() + timeout);

          const newToken = new Token({
            value: token,
            valid_to: validTo,
            owner: user._id
          });

          newToken.save(error => {
            if (error) {
              return res.status(404).json({
                reason: "Database session save error"
              });
            } else {
              return res.json({ token });
            }
          });
        } else {
          return res.status(401).json({
            password: "Wrong password"
          });
        }
      } else {
        return res.status(404).json({
          email: "Wrong username"
        });
      }
    });
  });

  // @path GET /api/user/
  // @desc Retrieve the user's data, according to given token
  // @access Private
  // @headers <token>
  router.get("/", (req, res) => {
    const token = req.headers.token;
    const User = app.model.user;
    if (isEmpty(token)) {
      return res.status(400).json({
        token: "No API token provided in headers"
      });
    }
    User.findByToken(token)
      .then(tokenOwner => {
        if (!isEmpty(tokenOwner)) {
          return res.json(tokenOwner);
        } else {
          return res
            .status(404)
            .json({ token: "Owner of that token was not found in database" });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Database error" });
      });
  });

  return router;
};
