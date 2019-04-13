const expressSession = require('./session');
const loginRedirect = require('./login_redirect');
module.exports = (app) => ({
    session: expressSession(app),
    loginRedirect: loginRedirect(app)
});