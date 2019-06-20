const expressSession = require('./session');
const loginRedirect = require('./login_redirect');
const dashboardRedirect = require('./dashboard_redirect');
module.exports = (app) => ({
    session: expressSession(app),
    loginRedirect: loginRedirect(app),
    dashboardRedirect: dashboardRedirect(app)
});