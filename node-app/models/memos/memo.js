module.exports = app => {
  const Schema = app.mongoose.Schema;
  const memoSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    header:{
      type: String,
      required: true
    },
    content: {
      type: String,
    }
  });

  return app.mongoose.model("memo", memoSchema);
};
