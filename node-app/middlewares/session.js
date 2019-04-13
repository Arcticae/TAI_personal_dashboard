const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

module.exports = (app) => 
    expressSession({
        name: 'session-id',
        cookie: {
            maxAge:  app.SESS_TIMEOUT * 60 * 1000,
            //reconsider this as we have to access site through hhtps for cookie to be secure (true reccomended)
            secure: process.env.NODE_ENV === 'prod',
            sameSite: true 
        },
        resave: false,
        saveUninitialized: false,
        secret: 'secret_str',
        store: new MongoStore({mongooseConnection: app.mongoose})
        //TODO set store for the cookie (mongodb)

    }
    );

