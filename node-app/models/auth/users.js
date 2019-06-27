const isEmpty = require("../../utils").params.isEmpty;
module.exports = app => {
  const userSchema = new app.mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      required: true
    }
  });

  userSchema.statics.findByToken = async token => {
    const Token = app.model.token;
    const dbToken = await Token.findOne({ value: token }).exec();
    if (!isEmpty(dbToken)) {
      const user = await app.mongoose
        .model("user")
        .findOne({ _id: dbToken.owner, deleted: false })
        .exec();
      if (!isEmpty(user)) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  return app.mongoose.model("user", userSchema);
};
