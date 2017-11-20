var passport = require('passport');

module.exports = function(req, res, next) {
//TODO: Check if Admin
  //  return res.forbidden('You are not permitted to perform this action.');

    passport.authenticate('jwt', function (error, user, info) {
        if (error) return res.serverError(error);
        if (!user){
            req.session.redirect = req.url;
            return res.redirect("/login");
        }
        //return res.unauthorized(null, info && info.code, info && info.message);
        console.log(user);

        User.find({id:user.id}).exec(function (err, records) {
            if (err) {
                console.log('got a server error');
            }
            else {
                console.log('retreived user from DB ...');
                console.log(records);
            }
            if (records[0].isAdmin()){
                console.log('he is an admin ....');
                return next();
            }
            else {
                console.log('he is not an admin ....');
                return res.json({
                    succ: false,
                    error : "Not Allowed",
                    message : "You do not have permission to perform this action"
                });
                next();
            }
        });
    })(req, res);
  //next();
};
