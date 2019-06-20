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
    }
  });

  return app.mongoose.model("user", userSchema);
};
