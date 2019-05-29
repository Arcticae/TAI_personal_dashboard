module.exports = (app) => ((req, res, next) => {
    if(req.session.userId !== undefined ){
        res.redirect('/dashboard');
    } else{
        next();
    }
 });