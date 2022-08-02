"use strict";

var express = require('express');

var route = express.Router();

var session = require('express-session');

var services = require('../services/render');

var controller = require('../controller/controller');

var passport = require('passport');

var axios = require('axios');

var res = require('express/lib/response');

var http = require('http');

var _require = require('../model/model'),
    $where = _require.$where;

var dns = require('dns');

var XMLHttpRequest = require('xhr2');

var _require2 = require('jsonwebtoken'),
    JsonWebTokenError = _require2.JsonWebTokenError;

var dbconnect = require('./new');

dbconnect();

var twilio = require("twilio");

var Comment = require('../model/comment');

var ipfine;
var data; // Auth middleware that checks if the user is logged in

var isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
/*
const requestListener = function (req, res) {
  res.end("Your IP Addresss is: " + req.socket.localAddress);
};
*/
// Initializes passport and passport sessions


route.use(passport.initialize());
route.use(passport.session()); // Example protected and unprotected routes

route.get('/', function (req, res) {
  return res.render('login');
});
route.get('/failed', function (req, res) {
  return res.send('You Failed to log in!');
}); // In this route you can see that if the user is logged in u can acess his info in: req.user

route.get('/protected', isLoggedIn, function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    res.render('index', {
      users: response.data
    });
    data = response.data;
  })["catch"](function (err) {
    res.send(err);
  });
}); // Auth Routes

route.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
route.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/failed'
}), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/add-user');
});
route.get('/logout', function (req, res) {
  req.session = null;
  req.logout();
  res.redirect('/');
});
dns.lookup('www.google.com', function (err, addresses, family) {
  // Print the address found of user
  ipfine = addresses;
  console.log('addresses:', addresses); // Print the family found of user  

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

global.globalstring;
route.get('/add-user', isLoggedIn, function (req, res) {
  res.render("add_user", {
    name: req.user.displayName,
    pic: req.user.photos[0].value,
    email: req.user.emails[0].value,
    ip: ipfine
  });
  globalstring = req.user.emails[0];
});
/**
 *  @description for update user
 *  @method GET /update-user
 */

route.get('/update-user', services.update_user);
route.get('/dashboard', isLoggedIn, function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    res.render("dashboard", {
      name: req.user.displayName,
      pic: req.user.photos[0].value,
      email: req.user.emails[0].value,
      users: response.data
    }); // global den response.data;
  });
});
route.get('/contact', isLoggedIn, function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    var string = '';
    newer = response.data;

    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].occupation == 'medical') {
        string = string + response.data[i].email + ',';
      }
    }

    var newstring, namerest;
    console.log(req.user.displayName);

    for (var _i = 0; _i < response.data.length; _i++) {
      console.log(response.data[_i].name);

      if (response.data[_i].name == req.user.displayName) {
        namerest = req.user.displayName;
        newstring = namerest + ' is in ' + 'Emergengy in ' + 'Longitude = ' + response.data[_i].longitude + "  " + 'Latitude = ' + response.data[_i].latitude;
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
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('message');
  });
});
route.get('/feedback', isLoggedIn, function (req, res) {
  res.render('feedback');
});
route.get('/maps', function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    res.render('maps2', {
      users: response.data
    });
  })["catch"](function (err) {
    res.send(err);
  });
});
route.get('/notifications', isLoggedIn, function (req, res) {
  axios.get('http://localhost:3000/api/users').then(function (response) {
    var SERVER = 'AAAAZSPmSFE:APA91bF5Tx569LRxkjeLvS52O-sBuZTJyqbXY0pAWQsOGAjC_OfFDZFTgcC0F7SIl0-fmd9fJsLm-uXs2pUoewmBwVB2ncdm9O8tZTsCj2GPg5uaRIN98zD4CpTTMUT4GBGLtBH-JnyF';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
    xhr.setRequestHeader("Authorization", "key=".concat(SERVER));
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(1);
        console.log(xhr.responseText);
      }
    };

    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].name == req.user.displayName) {
        namerest = req.user.displayName;
        newstring = 'Emergengy in ' + 'Longitude = ' + response.data[i].longitude + "  " + 'Latitude = ' + response.data[i].latitude;
      }
    }

    namerest = namerest + " is in" + " " + newstring;
    namerest = JSON.stringify(namerest);
    newstring = JSON.stringify(newstring);
    var data = {
      'to': "/topics/Medical",
      'notification': JSON.parse("{\"title\": \"Alert\",\"body\":".concat(namerest, "}"))
    };

    try {
      xhr.send(JSON.stringify(data));
    } catch (err) {
      console.log(err.message);
    }

    res.redirect('/contact');
  })["catch"](function (err) {
    res.send(err);
  });
});
route.get('/sms', function (req, res) {
  var client = twilio('AC22aea57c5a10bac0a39bcbc3e9766371', 'cb4bef8fa8ad29ef7b5ba5e1c88c56a1');

  function sendSMS(from, to, body) {
    client.messages.create({
      from: from,
      to: to,
      body: body
    }).then(function (message) {
      console.log("SMS message sent from ".concat(from, " to ").concat(to, ". Message SID: ").concat(message.sid));
    })["catch"](function (error) {
      console.error(error);
    });
  }

  sendSMS('+16109983819', '+919880403698', "This is an SMS notification!");
});
route.post('/api/comments', function (req, res) {
  var comment = new Comment({
    username: req.body.username,
    comment: req.body.comment
  });
  comment.save().then(function (response) {
    res.send(response);
  });
});
route.get('/api/comments', function (req, res) {
  Comment.find().then(function (comments) {
    res.send(comments);
  });
}); // API

route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route["delete"]('/api/users/:id', controller["delete"]);
module.exports = route;