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
app.middlewares = require('./middlewares');
//use cookie session with expiration time
app.use(app.middlewares.session(SESS_TIMEOUT));

app.get('/', (req, res) => {
    console.log(request);
    response.send('Hai there');
});

app.listen(APP_PORT, () => {
    console.log(`App is listening on port ${APP_PORT}`);
});