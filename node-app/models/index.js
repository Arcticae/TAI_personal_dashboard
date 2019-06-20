const usersModel = require("./users");
const tokenModel = require("./tokens");
//add your models here
module.exports = app => ({
  user: usersModel(app),
  token: tokenModel(app)
});
