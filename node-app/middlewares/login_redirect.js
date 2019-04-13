module.exports = (app) => ((req, res, next) => {
   if(!req.sessionUserId){
       res.redirect('/login');
   } else{
       next();
   }
}) 