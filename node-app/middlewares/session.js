const expressSession = require('express-session');
module.exports = (sessionTimeout) => {
    expressSession({
        name: 'session-id',
        cookie: {
            maxAge:  sessionTimeout * 60 * 1000,
            secure: true 
        }
    }
    )
}
