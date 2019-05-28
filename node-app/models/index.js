const usersModel = require('./users');
const counterModel = require('./counters');
//add your models here 
module.exports = (app) => ({
    user:usersModel(app),
    counter:counterModel(app)
});