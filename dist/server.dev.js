

var express = require('express');

var dotenv = require('dotenv');

var session = require('express-session');

var passport = require('passport');

var morgan = require('morgan');

var bodyparser = require("body-parser");

var path = require('path');

require('./server/routes/auth');

require('./server/routes/router');

var connectDB = require('./server/database/connection');
/*
const dbConnect = require('./db')
dbConnect()

*/
//const Comment = require('./models/comment')


var axios = require('axios');

var services = require('./server/services/render');

var controller = require('./server/controller/controller');

var cookieParser = require('cookie-parser');

var cookieSession = require('cookie-session');

var socket = require("socket.io");

var cors = require('cors');

var app = express();
app.use(express.json());
dotenv.config({
  path: 'config.env'
});
var PORT = process.env.PORT || 3000; // log requests

app.use(morgan('tiny')); // mongodb connection

connectDB(); // parse request to body-parser

app.use(bodyparser.urlencoded({
  extended: true
})); // set view engine

app.set("view engine", "ejs"); //app.set("views", path.resolve(__dirname, "views/ejs"))
//app.set('views', path.join(__dirname, 'views'));
// load assets

app.use('/css', express["static"](path.resolve(__dirname, "assets/css")));
app.use('/img', express["static"](path.resolve(__dirname, "assets/img")));
app.use('/js', express["static"](path.resolve(__dirname, "assets/js")));
app.use(express["static"](path.resolve(__dirname, "views")));
app.use(cookieParser());
app.use(express["static"]('public'));
app.use(bodyparser.json()); // support json encoded bodies

app.use(bodyparser.urlencoded({
  extended: true
})); // support encoded bodies

app.use(cors());
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}));
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./server/routes/router'));
app.use('/google', require('./server/routes/router'));
var server = app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log("New connection: ".concat(socket.id)); // Recieve event

  socket.on('comment', function (data) {
    data.time = Date();
    socket.broadcast.emit('comment', data);
  });
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data);
  });
});