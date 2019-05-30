"use strict";
const utils = require('./utils');

const express = require('express');
const schedule = require('node-schedule');
const app = express();
app.mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();

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
app.mongoose.connect(app.config.mongoDBPath, app.config.dbConnectionOptions);
app.mongoose.connection.once('open', () => {
    start_app();
});

function start_app() {
    app.model = require('./models')(app);
    app.middlewares = require('./middlewares')(app);
    app.get('/', (req, res) => {
    });
    app.get('/dashboard', app.middlewares.loginRedirect, (req, res) => {
    });
    app.get('/login', app.middlewares.dashboardRedirect, (req, res) => {
    });
    app.get('/register', (req, res) => {
    });


    app.post('/login', app.middlewares.dashboardRedirect, upload.none(), (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (!(email && password))
            res.json({error: true, reason: "Insufficient parameters supplied to request"});

        app.model.user
            .findOne({email: email})
            .exec((err, user) => {
                if (err) {
                    res.json({error: true, reason: "Database threw an error while looking for user with that name"});
                } else if (user) {
                    if (user.password === password) {
                        let token = utils.security.hashToken(16);
                        let timeout = app.config.SESS_TIMEOUT * 60000;
                        let validTo = new Date(Date.now() + timeout);
                        const tokenObject = new app.model.token({value: token, valid_to: validTo});
                        tokenObject.save((error) => {
                            if (error) {
                                res.json({error: true, reason: "Database threw an error while saving your session"});
                            } else {
                                res.json({authorized: true, token: token});
                            }
                        });
                    } else {
                        res.json({authorized: false, reason: "Wrong password for given user"});
                    }
                } else {
                    res.json({authorized: false, reason: "User with given credentials does not exist"});
                }
            });
    });

//Post for creating new user
    app.post('/register', app.middlewares.dashboardRedirect, upload.none(), (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;

        if (!(username && password && email))
            res.json({error: true, reason: "Insufficient parameters supplied to request"});

        email = email.toLowerCase();
        app.model.user
            .findOne({email: email})
            .exec(async (err, db_user) => {
                    if (err) {
                        res.json({error: true, reason: "Database threw an error while looking for user with that name"});
                    } else if (db_user) {
                        res.json({success: false, reason: "User with this e-mail already exists"});
                    } else if (!db_user) {
                        //TODO: move creating a user to statics?
                        let nextUserId = (await app.model.counter.getNextId("userid")).seq;
                        let new_user = new app.model.user({
                            id: nextUserId,
                            username: username,
                            //TODO: store the password as MD5 or sth
                            password: password,
                            email: email
                        });
                        new_user.save((error) => {
                            if (error) {
                                res.json({error: true, reason: "Database threw an error while saving user info"});
                            } else {
                                res.json({success: true});
                            }
                        });
                    }
                }
            );

    });
    //revoke token in query

    app.post('/logout', app.middlewares.loginRedirect, upload.none(), (req, res) => {
        let token = req.body.token;
        if (!token)
            res.json({error: true, reason: "Insufficient parameters supplied to request"});
        app.model.token
            .findOneAndDelete({value: token})
            .exec((error, _) => {
                if (error)
                    res.json({error: true, reason: "Token revoke went wrong"});
                else
                    res.redirect("/");
            });
    });


    //TODO: move scheduled jobs somewhere?
    //FIXME: schedule slowers
    //schedule some jobs here, like automatic removing revoked tokens from db
    schedule.scheduleJob(` */${app.config.SESS_TIMEOUT} * * * * `, () => {
        console.log("[INFO] Scheduled revoked tokens removal is in process");

        app.model.token
            .deleteMany({
                valid_to: {$lt: new Date(Date.now())}
            })
            .exec((error,_)=>{
                if(error)
                    console.log("[ERROR] Something went wrong with execution of scheduled token removal");
            });

    });

    app.listen(config.APP_PORT, () => {
        console.log(`App is listening on port ${config.APP_PORT}`);
    });

}