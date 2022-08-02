"use strict";

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function (user, done) {
  /*
  From the user take just the id (to minimize the cookie size) and just pass the id of the user
  to the done callback
      */
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  /*
  Instead of user this function usually recives the id 
  then you use the id to select the user from the db and pass the user obj to the done callback
      */
  done(null, user);
});
passport.use(new GoogleStrategy({
  clientID: '155474456645-81ntgci89to87f3s1uaomcn21nv5dlne.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/google/callback',
  passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
  console.log(profile);
  return done(null, profile);
}));