module.exports = app => {
  const Schema = app.mongoose.Schema;
  const reminderSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  });
  return app.mongoose.model("reminder", reminderSchema);
};
