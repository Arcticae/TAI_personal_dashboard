const loginRedirect = require("./login_redirect");
module.exports = app => ({
  loginRedirect: loginRedirect(app)
});
