"use strict";

var mongoose = require('mongoose');

var connectDB = function connectDB() {
  var con;
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect('mongodb+srv://csdappnitk:csdappnitk2022@cluster0.j5wc1.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 3:
          con = _context.sent;
          console.log("MongoDB connected : ".concat(con.connection.host));
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          process.exit(1);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = connectDB;