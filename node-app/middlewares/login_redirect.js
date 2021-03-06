const isEmpty = require("../utils/").params.isEmpty;
module.exports = app => (req, res, next) => {
  const token = req.headers.token;
  const Token = app.model.token;

  if (!isEmpty(token)) {
    Token.findOne({ value: token })
      .then(dbToken => {
        if (dbToken) {
          if (dbToken.valid_to > new Date(Date.now())) {
            next(); //Token is valid
          } else {
            return res.status(401).json({ token: "Token has expired" });
          }
        } else {
          return res.status(404).json({ token: "Token not found" });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(404).json({ reason: "Database unavailable" });
      });
  } else {
    return res
      .status(401)
      .json({ token: "No API token provided in the headers" });
  }
};
