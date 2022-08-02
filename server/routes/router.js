const express = require('express');
const route = express.Router()
const session = require('express-session');
const services = require('../services/render');
const controller = require('../controller/controller');
const passport = require('passport');
const axios = require('axios');
const res = require('express/lib/response');
const http = require('http');
const { $where } = require('../model/model');
const dns = require('dns')
const XMLHttpRequest = require('xhr2');
const { JsonWebTokenError } = require('jsonwebtoken');
const dbconnect = require('./new');
dbconnect();
const twilio = require("twilio");
const Comment = require('../model/comment');
var ipfine;
var data;


// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}


/*
const requestListener = function (req, res) {
  res.end("Your IP Addresss is: " + req.socket.localAddress);
};
*/


// Initializes passport and passport sessions
route.use(passport.initialize());
route.use(passport.session());

// Example protected and unprotected routes
route.get('/', (req, res) => res.render('login'))
route.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
route.get('/protected', isLoggedIn, (req, res) =>{
  
  axios.get('http://localhost:3000/api/users')
  .then(function(response){
      res.render('index', { users : response.data });
      data = response.data;
   })
  .catch(err =>{
      res.send(err);
  })
});

// Auth Routes
route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

route.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
function(req, res) {
  // Successful authentication, redirect home.
 

    res.redirect('/add-user');
 

});

route.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})


dns.lookup('www.google.com', 
(err, addresses, family) => {
  
    // Print the address found of user
    ipfine=addresses;
    console.log('addresses:', addresses);
  
    // Print the family found of user  
    console.log('family:', family);
});


/**
 *  @description Root Route
 *  @method GET /
 */


/**
 *  @description add users
 *  @method GET /add-user
 */

global.globalstring ;
route.get('/add-user',isLoggedIn, (req,res)=>{
    res.render("add_user",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value,ip:ipfine})
     globalstring = req.user.emails[0];
     
})

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', services.update_user)
route.get('/dashboard',isLoggedIn,(req,res)=>{
  axios.get('http://localhost:3000/api/users')
  .then(function(response){
    res.render("dashboard",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value,users:response.data})
  // global den response.data;
   })

 


});


route.get('/contact',isLoggedIn,(req,res)=>{


  axios.get('http://localhost:3000/api/users')
  .then(function(response){
    var string='';
    newer =response.data;
    for(let i =0 ; i<(response.data).length;i++){
       if(response.data[i].occupation=='medical'){
         string=string+response.data[i].email+',';
       }


    }
    var newstring , namerest;
    console.log(req.user.displayName)
    for(let i=0;i<(response.data).length;i++){
      console.log(response.data[i].name);
      if(response.data[i].name==req.user.displayName){
        namerest = req.user.displayName;
        newstring =namerest+' is in '+ 'Emergengy in '+ 'Longitude = '+response.data[i].longitude + "  "+'Latitude = '+response.data[i].latitude;

      }
    }
    console.log(newstring);
    console.log(string);
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'csdappnitk@gmail.com',
        pass: 'csdappnitk2022'
      }
    });
    
    var mailOptions = {
      from: 'csdappnitk@gmail.com',
      to: string,
      subject: 'CSD Website Alarming Emergency Mail',
      text: newstring
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('message');
   
   })
 
})

route.get('/feedback',isLoggedIn,(req,res)=>{


  res.render('feedback');
})

route.get('/maps',(req,res)=>{
  axios.get('http://localhost:3000/api/users')
  .then(function(response){
      res.render('maps2', { users : response.data });
    })
  .catch(err =>{
      res.send(err);
  })
  
})

route.get('/notifications',isLoggedIn,(req,res)=>{
  axios.get('http://localhost:3000/api/users')
  .then(function(response){
  
const SERVER = 'AAAAZSPmSFE:APA91bF5Tx569LRxkjeLvS52O-sBuZTJyqbXY0pAWQsOGAjC_OfFDZFTgcC0F7SIl0-fmd9fJsLm-uXs2pUoewmBwVB2ncdm9O8tZTsCj2GPg5uaRIN98zD4CpTTMUT4GBGLtBH-JnyF'
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
xhr.setRequestHeader("Authorization",`key=${SERVER}`);
xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    console.log(xhr.status);
    console.log(1);
    console.log(xhr.responseText);
  }};

  
  for(let i=0;i<(response.data).length;i++){
   
    if(response.data[i].name==req.user.displayName){
      
      namerest = req.user.displayName;
      newstring = 'Emergengy in '+ 'Longitude = '+response.data[i].longitude + "  "+'Latitude = '+response.data[i].latitude;

    }
  }
  namerest = namerest +" is in"+" "+newstring;
  namerest = JSON.stringify(namerest);
  newstring = JSON.stringify(newstring);
let data = {
    'to': "/topics/Medical",
    'notification':JSON.parse(`{"title": "Alert","body":${namerest}}`)
  };
  try{

xhr.send(JSON.stringify(data));

  }
  catch(err){
    console.log(err.message);
  }
res.redirect('/contact');
})
.catch(err =>{
  res.send(err);
}) 

})


route.get('/sms',(req,res)=>{
  const client = twilio(
    'AC22aea57c5a10bac0a39bcbc3e9766371',
    'cb4bef8fa8ad29ef7b5ba5e1c88c56a1'
  );
  
  function sendSMS(from, to, body) {
    client.messages
      .create({ from, to, body })
      .then((message) => {
        console.log(
          `SMS message sent from ${from} to ${to}. Message SID: ${message.sid}`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  sendSMS(
    '+16109983819' ,
    '+919880403698',
    "This is an SMS notification!"
  );
})


route.post('/api/comments', (req, res) => {
  const comment = new Comment({
      username: req.body.username,
      comment: req.body.comment
  })
  comment.save().then(response => {
      res.send(response)
  })

})

route.get('/api/comments', (req, res) => {
  Comment.find().then(function(comments) {
      res.send(comments)
  })
})



// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);

route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);


module.exports = route
