const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const APP_PORT = 6969;
const app = express();
app.use(cors());
const router = express.router();

//connect with backend's database.