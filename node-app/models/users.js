//This is a stub of a model implementation 
module.exports = (app) => {

    const userSchema = new app.mongoose.Schema({
        id: Number,
        username: String,
        password: String,
        email: String
    });

    return app.mongoose.model('user', userSchema);
};

