var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/usuarios');
var fs = require("fs");
module.exports = function(passport) {
    passport.use('local',new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password'
    },
        function(usuario, password, done) {
            User.findOne({ "username":usuario,"password":password },function(err,user){
                return done(null, user);
            });
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};