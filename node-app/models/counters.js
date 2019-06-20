//This is a stub of a model implementation
module.exports = (app) => {

    const counterSchema = new app.mongoose.Schema({
        _id: String,
        seq: Number
    });
    //Autointcrement function
    counterSchema.statics.getNextId = async (name) => {
      //id is a promise
        return await app.model.counter.findOneAndUpdate(
            {_id: name},
            {$inc: {seq: 1}},
            {})
            .exec();
    };

    let Counter = app.mongoose.model('counter', counterSchema);
    //add new counters here
    //userid counter
    Counter.create(
        {
            _id: "userid",
            seq: 0
        },
        (err, obj) => {
            if (err)
                console.log("There has been an error during creation of userid seq object, error: " + err);
        }
    );
    return Counter;
};

