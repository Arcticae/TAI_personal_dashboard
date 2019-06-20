const usersModel = require('./users');
const counterModel = require('./counters');
const tokenModel = require('./tokens');
//add your models here
module.exports = (app) => ({
    user:usersModel(app),
    counter:counterModel(app),
    token:tokenModel(app)
});