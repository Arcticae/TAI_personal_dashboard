module.exports = app => {
  const Schema = app.mongoose.Schema;
  const eventSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    header: {
      type: String,
      required: true
    },
    content: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    reminders: [
      {
        type: Schema.Types.ObjectId
      }
    ]
  });

  return app.mongoose.model("event", eventSchema);
};
