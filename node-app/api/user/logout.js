const express = require("express");
const router = express.Router();
// @path POST /api/user/logout
// @desc Log out the user (revoke the token from the header)
// @access Private
// @header <token>
// @body <token>
module.exports = app => {
  router.post("/logout", app.middlewares.loginRedirect, (req, res) => {
    const token = req.headers.token;
    if (!token)
      return res.json({
        token: "API token not provided in the headers"
      });
    app.model.token
      .findOneAndDelete({ value: token })
      .then(_ => {
        return res.status(204).json({});
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Token revoke went wrong" });
      });
  });
  return router;
};
