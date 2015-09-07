var db = require('../config/namespace').dbConnect.db;
var User = db.models.users;
var controller = db.controllers.auth;
var modules = require('../../../modules');
var LocalStrategy = modules.passportlocal.Strategy;

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
      console.log('serializing user: ');
      console.log(JSON.stringify(user));
      done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          console.log('deserializing user:',user);
          done(err, user);
      });
  });

  passport.use('signup', new LocalStrategy({
        passReqToCallback : true
      },
      function(req, username, password, done) {
          console.log('Signup: registering user ' + username);
          controller.register(req, done);
      })
  );

  passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
          console.log('Login: logging-in user ' + username);
          controller.login(req, done);
        })
    );

}
