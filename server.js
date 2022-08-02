const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
require('./server/routes/auth');
require('./server/routes/router');
const connectDB = require('./server/database/connection');




/*
const dbConnect = require('./db')
dbConnect()

*/
//const Comment = require('./models/comment')


const axios = require('axios');
const services = require('./server/services/render');
const controller = require('./server/controller/controller');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const socket = require("socket.io");
var cors = require('cors')
const app = express();

app.use(express.json())

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 3000


// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))
//app.set('views', path.join(__dirname, 'views'));
// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use( express.static(path.resolve(__dirname, "views")))

app.use(cookieParser());
app.use(express.static('public'))


app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())

app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./server/routes/router'))

app.use('/google', require('./server/routes/router'))






const server = app.listen(PORT, ()=> 
{ 
  console.log(`Server is running on http://localhost:${PORT}`)
  
});



let io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)
    // Recieve event
    socket.on('comment', (data) => {
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data) 
    })
})

