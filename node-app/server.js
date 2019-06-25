const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

const { 
    SESS_TIMEOUT = 10,
    APP_PORT = 6969
} = process.env;

const app = express();
const router = express.Router();

//put our middlewares into app object
//app.middlewares = require('./middlewares');
//use cookie session with expiration time
app.use(expressSession({
    name: 'session-id',
    cookie: {
        maxAge:  SESS_TIMEOUT * 60 * 1000,
        secure: true 
    },
    secret: 'lmao'
}));

app.get('/', (req, res) => {
    console.log(`res sent`);
    res.send('response from node');
});

app.listen(APP_PORT, () => {
    console.log(`App is listening on port ${APP_PORT}`);
});