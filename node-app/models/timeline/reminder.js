module.exports = app => {
  const Schema = app.mongoose.Schema;
  const reminderSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    content: {
      type: String
    }
  });
  return app.mongoose.model("reminder", reminderSchema);
};
