//This is a stub of a model implementation
module.exports = (app) => {

    const counterSchema = new app.mongoose.Schema({
        _id: String,
        seq: Number
    });
    //Autointcrement function
    counterSchema.statics.getNextId = (name) => {
        let nextId = app.mongoose.findAndModify(
            {
                query: {_id: name},
                update: {$inc: {seq: 1}},
                new: true
            }
        );
        return nextId.seq;
    };

    let Counter = app.mongoose.model('counter', counterSchema);
    //add new counters here
    //userid counter
    Counter.create(
        {
            _id: "userid",
            seq: 0
        },
        (err,obj) => {
            if(err)
                console.log("There has been an error during creation of userid seq object, error: " + err);
        }
    );
    return Counter;
};

