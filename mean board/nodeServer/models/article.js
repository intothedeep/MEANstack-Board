var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var articleSchema = new Schema({
	seq: Number,
	user : {
    id: String,
    name: String
  },
  content : String,
	subject : String,
  time: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('article', articleSchema);
