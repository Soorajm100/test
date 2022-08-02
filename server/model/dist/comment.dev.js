"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    require: true
  }
}, {
  timestamps: true
});
var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;