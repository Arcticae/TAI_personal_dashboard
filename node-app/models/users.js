//This is a stub of a model implementation 
module.exports  = (app) => {
    const Schema = app.mongoose.Schema;
    const userSchema = new Schema({
        id: Number,
        username: String,
        password: String,
        email: String
    });
    userSchema.methods.findById = (id) =>{
        //TODO: IMPLEMENT
    };
    userSchema.methods.exists = (id) =>{
        //TODO: IMPLEMENT
    }
    
    const user = app.mongoose.model('user', userSchema);
    return user;
} 

