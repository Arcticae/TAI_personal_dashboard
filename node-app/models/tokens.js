module.exports = app => {
  //TODO:  Add a limit of tokens per user (security vulnerability)
  const Schema = app.mongoose.Schema;
  const Token = new Schema({
    value: {
      type: String,
      required: true
    },
    valid_to: {
      type: Date,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    }
  });

  return app.mongoose.model("token", Token);
};
