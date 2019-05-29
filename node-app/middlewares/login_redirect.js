module.exports = (app) => ((req, res, next) => {
   if( req.session.userId === undefined){
       console.log(req.session);
       console.log("User not logged in. Redirecting...");
       res.redirect('/login');
   } else{
       next();
   }
});
