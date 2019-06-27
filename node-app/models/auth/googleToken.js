module.exports = app => {
  const Schema = app.mongoose.Schema;
  const googleTokenSchema = new Schema({
    token: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true }
  });

  return app.mongoose.model("googleToken", googleTokenSchema);
};
