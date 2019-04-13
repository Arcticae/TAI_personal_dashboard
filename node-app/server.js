"use strict"
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.mongoose = require('mongoose');
//seting env defaults (TODO -> move this to another location)
const config = {
    mongoDBPath: 'mongodb://localhost/node-app-db',
    SESS_TIMEOUT: 10,
    APP_PORT: 6969,
    dbConnectionOptions: {
        useNewUrlParser: true,
        autoIndex: process.env.NODE_ENV === 'dev',
        reconnectInterval: 1000 //miliseconds
    }
};
const router = express.Router();

//connect with db 

app.db = app.mongoose.connect(config.mongoDBPath,config.dbConnectionOptions);

//create models
app.model = require('./models')(app);
//create middlewares
app.middlewares = require('./middlewares')(app);
//use cookie session with expiration time

//Load some default middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(app.middlewares.session);
app.use(app.middlewares.loginRedirect);


app.get('/', (req, res) => {
    let userId = req.session;
    console.log(userId);
    res.send('Hai there');
});

app.get('/dashboard', (req, res) => {

});
app.get('/login', app.middlewares.dashboardRedirect, (req, res) => {

});
app.get('/register', app.middlewares.dashboardRedirect, (req, res) => {
    var create_params = {};
    var new_user = new app.model.user({});
});

app.post('/login', app.middlewares.dashboardRedirect, (req, res) => {

    // req.session.userId = 'someid' //from database
});
app.post('/register', app.middlewares.dashboardRedirect, (req, res) => {

});
app.post('/logout', app.middlewares.dashboardRedirect, (req, res) => {

});

app.listen(app.APP_PORT, () => {
    console.log(`App is listening on port ${config.APP_PORT}`);
});