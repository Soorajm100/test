

function dbConnect(){
const  mongoose = require('mongoose');
db = mongoose.createConnection('mongodb://localhost/comments');
//db.open('localhost');
}
module.exports = dbConnect;


