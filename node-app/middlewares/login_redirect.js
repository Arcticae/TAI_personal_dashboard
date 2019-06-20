module.exports = (app) => ((req, res, next) => {
   if( req.token === undefined){
       res.redirect('/login');
   } else{
       next();
   }
});
