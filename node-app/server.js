"use strict";
const express = require('express');

const app = express();
app.mongoose = require('mongoose');
app.use(express.json({extended: true}));       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support some other shit
const config = {
    mongoDBPath: 'mongodb://mongodb:27017/node-app-db',
    SESS_TIMEOUT: 10,
    APP_PORT: 6969,
    dbConnectionOptions: {
        useNewUrlParser: true,
        autoIndex: process.env.NODE_ENV === 'dev',
        reconnectInterval: 1000 //miliseconds
    }
};

app.config = config;
const router = express.Router();
//todo: god this is awful, connection to db
app.mongoose.connect(app.config.mongoDBPath, app.config.dbConnectionOptions);
app.mongoose.connection.once('open', () => {
    start_app();
});

function start_app() {
    //create models
    app.model = require('./models')(app);
    //create middlewares
    app.middlewares = require('./middlewares')(app);
    //and use them
    app.use(app.middlewares.session);

    app.get('/', (req, res) => {
        //Todo remove this: is a placeholder for frontend

        res.send(
            "<h1>Hey, want to login? Or maybe register?</h1>" +
            "<a href =  '/login'>Login</a>" +
            "<a href = '/register'>Register</a>" +
            "<a href = '/dashboard'> Dashboard</a>" +
            "<form method = 'post' action = '/logout'>" +
            "<button type='submit'>Log out</button>"
            + "</form>");
    });

    app.get('/dashboard', app.middlewares.loginRedirect, (req, res) => {
        res.send("<h1>Dashboard placeholder<h1>");
    });
    app.get('/login', app.middlewares.dashboardRedirect, (req, res) => {
        res.send("<h1>Login placeholder<h1>" +
            "<form method = 'post' action='/login'>" +
            "<input type ='email' name = 'email' placeholder='Email' required/>" +
            "<input type ='password' name = 'password' placeholder='Password' required/>" +
            "<button type ='submit'>Log in!</button>" +
            "</form> "
            + "<a href = '/register'>Register</a>"
        );
    });
    app.get('/register', (req, res) => {
        res.send("<h1>Register placeholder<h1>" +
            "<form method = 'post' action='/register'>" +
            "<input type ='text' name = 'username' placeholder='Username' required/>" +
            "<input type ='email' name = 'email' placeholder='Email' required/>" +
            "<input type ='password' name = 'password' placeholder='Password' required/>" +
            "<button type ='submit'>Register</button>" +
            "</form> ");
    });

    app.post('/login', app.middlewares.dashboardRedirect, (req, res) => {
            let email = req.body.email.toLowerCase();
            let password = req.body.password;

            app.model.user
                .find({email: email})
                .exec((err, users) => {
                    if (err) {
                        //TODO: reutrn db error to frontend
                        console.log("Error in database search: " + err);

                    } else if (users.length) {
                        //user exists, check password
                        //todo swap function for findOne to avoid this
                        let user = users[0];
                        console.log("User found " + user);
                        if (user.password === password) {
                            console.log("Assigning userid %s to session token", user.id);
                            req.session.userId = user.id;
                            console.log(req.session);
                            res.redirect('/dashboard');
                        } else {
                            res.send("<h2>Wrong password. Try again?</h2>" +
                                "<a href ='/register'>Register</a>" +
                                "<a href ='/login'>Log in</a>"
                            );
                        }
                    } else {
                        console.log("Query result: " + users);
                        //TODO: user not found, send info to backend that he doesn't exist
                        res.send("<h2>Client does not exist. Try again?</h2>" +
                            "<a href ='/register'>Register</a>" +
                            "<a href ='/login'>Log in</a>"
                        );
                    }
                });


        }
    );
//Post for creating new user
    app.post('/register', app.middlewares.dashboardRedirect, (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email.toLowerCase();
        console.log("Got a query to register user %s with password %s and email %s", username, password, email);
        app.model.user
            .find({username: username})
            .exec( async (err, db_user) => {
                    if (err) {
                        //TODO: error in search for user in db
                        console.log("error during searching for user in db: " + err);
                    } else if (db_user.length) {
                        //TODO: return info to frontend, that user exists
                        console.log('User with this name already exists.');
                        console.log(db_user);
                        res.send("<h1>Register<h1>" +
                            "<h2>User with this username already exists. Wanna try again?</h2>" +
                            "<form method = 'post' action='/register'>" +
                            "<input type ='text' name = 'username' placeholder='Username' required/>" +
                            "<input type ='email' name = 'email' placeholder='Email' required/>" +
                            "<input type ='password' name = 'password' placeholder='Password' required/>" +
                            "<button type ='submit'>Register</button>" +
                            "</form> " +
                            "<a href='/login'>Maybe login?</a>");

                    } else if (!db_user.length) {
                        //TODO: move this to another module
                        let nextUserId = (await app.model.counter.getNextId("userid")).seq;
                        console.log("Getting next id: %s and assigning it to user %s", nextUserId, username);
                        let new_user = new app.model.user({
                            id: nextUserId,
                            username: username,
                            //TODO: store the password as MD5 or sth
                            password: password,
                            email: email
                        });
                        new_user.save((error) => {
                            //TODO throw error
                            if (error) {
                                console.log("There has been an error saving the data to DB, reason: " + error);
                                res.redirect('/register');
                            } else {
                                req.session.userId = new_user.id;
                                res.redirect('/dashboard');
                            }
                        });

                    }
                }
            );

    });
    app.post('/logout', app.middlewares.loginRedirect, (req, res) => {
        console.log("Trying to log out");

    });

    app.listen(config.APP_PORT, () => {
        console.log(`App is listening on port ${config.APP_PORT}`);
    });

}