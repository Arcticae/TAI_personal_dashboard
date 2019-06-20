module.exports = app => {
  const Schema = app.mongoose.Schema;
  const toDoListSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    content: [{ done: Schema.Types.Boolean, content: String }]
  });

  return app.mongoose.model("toDoList", toDoListSchema);
};
