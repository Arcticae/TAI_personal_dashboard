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
  userSchema.static("findByToken", token => {
    app.models.token
      .findOne({ value: token })
      .then(dbToken => {
        if (dbToken) {
          const userId = dbToken.owner;
          this.findOne({ _id: userId })
            .then(user => {
              return user;
            })
            .catch(err => {
              return null;
            });
        } else {
          return null;
        }
      })
      .catch(err => {
        return null;
      });
  });

  return app.mongoose.model("user", userSchema);
};
