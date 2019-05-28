module.exports = (app) => ((req, res, next) => {
   if(!req.session.UserId){
       res.redirect('/login');
   } else{
       next();
   }
});
