const usersModel = require('./users')
//add your models here 
module.exports = (app) => ({
    user:usersModel(app)
});