module.exports = (app) => {
    //TODO: Ad association between user and a token, and add a limit (security vulnerability)
    const Token = new app.mongoose.Schema({
        value: String,
        valid_to: Date
    });

    return app.mongoose.model('token', Token);
};

