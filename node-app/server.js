const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const { 
    SESS_TIMEOUT = 10,
    APP_PORT = 6969
} = process.env;

const app = express();
const router = express.Router();

//put our middlewares into app object
var middlewares = require('./middlewares/index.js');
//use cookie session with expiration time
app.use(middlewares);

app.get('/', (req, res) => {
    console.log("req");
    res.send('Hai there');
});

app.listen(APP_PORT, () => {
    console.log(`App is listening on port ${APP_PORT}`);
});