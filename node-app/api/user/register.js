const express = require("express");
const router = express.Router();
const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  // @path POST /api/user/register
  // @desc Register the user and retrieve the token
  // @access Public
  // @body <email> <password> <username>
  router.post("/register", (req, res) => {
    const User = app.model.user;

    let { username, password, email } = req.body;

    let errors = {};
    if (isEmpty(email)) {
      errors.email = "E-Mail field cannot be empty";
    }
    if (isEmpty(username)) {
      errors.username = "Username field cannot be empty";
    }
    if (isEmpty(password)) {
      errors.password = "Password field cannot be empty";
    }
    if (!isEmpty(errors)) {
      return res.status(400).json(errors);
    }
    //TODO: jesus fucking christ remove this async
    email = email.toLowerCase();
    User.findOne({
      $and: [{ $or: [{ email }, { username }] }, { deleted: false }]
    }).exec(async (err, dbUser) => {
      if (err) {
        return res.status(404).json({
          reason: "Database unavailable"
        });
      } else if (dbUser) {
        const errors = {};
        if (dbUser.email === email) {
          errors.email = "User with that e-mail address already exists";
        }
        if (dbUser.username === username) {
          errors.username = "User with that username already exists";
        }
        return res.status(400).json(errors);
      } else {
        let newUser = new User({
          username,
          //FIXME: store the password as MD5 or sth
          password,
          email,
          deleted: false
        });
        newUser.save(error => {
          if (error) {
            return res.status(404).json({
              reason: "Database threw an error while saving user info"
            });
          } else {
            return res.json(newUser);
          }
        });
      }
    });
  });
  return router;
};
