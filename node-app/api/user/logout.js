const express = require("express");
const router = express.Router();
// @path POST /api/user/logout
// @desc Log out the user (revoke the token from the header)
// @access Private
// @header <token>
// @body <token>
module.exports = app => {
  router.post(
    "/logout",
    app.middlewares.loginRedirect,
    app.middlewares.upload.none(),
    (req, res) => {
      let token = req.body.token;
      if (!token)
        return res.json({
          error: true,
          reason: "Insufficient parameters supplied to request"
        });
      app.model.auth.token
        .findOneAndDelete({ value: token })
        .exec((error, _) => {
          if (error)
            return res.status(404).json({ reason: "Token revoke went wrong" });
        });
    }
  );
  return router;
};
