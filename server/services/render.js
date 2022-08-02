const axios = require('axios');
const res = require('express/lib/response');
const { $where } = require('../model/model');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
 
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {

    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:'155474456645-81ntgci89to87f3s1uaomcn21nv5dlne.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:3000/google/callback',
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null, profile);
  }
));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
  }


/*

exports.homeRoutes = (req, res) => {
    // Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
        .then(function(response){
        
            res.render('dashboard', { users : response.data });
            
            
            
        })
        .catch(err =>{
            res.send(err);
        })

}
/*

/*
exports.add_user = (req, res) =>{
    res.render('add_user');
}
*/

exports.update_user = (req, res) =>{
    axios.get('http://localhost:3000/api/users', { params : { id : req.query.id }})
        .then(function(userdata){
            res.render("update_user", { user : userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.login = ()=>{
    res.render('login')

}
/*
exports.dashboard = ()=>{
    axios.get('http://localhost:3000/api/users')
    .then(function(response){
        res.render('dashboard', { users : response.data });
        
        
    })
    .catch(err =>{
        res.send(err);
    })
}
*/