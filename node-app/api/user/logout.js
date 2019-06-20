const express = require("express");
const router = express.Router();
module.exports = app => {
  app.post(
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
      app.model.token.findOneAndDelete({ value: token }).exec((error, _) => {
        if (error)
          return res.status(404).json({ reason: "Token revoke went wrong" });
      });
    }
  );
  return router;
};
