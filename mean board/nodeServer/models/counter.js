var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var counterSchema = new Schema({
  _id: String,
  next: {
     type: Number,
     default: 1
   }
});

//counter: 시쿼스가 들어가있는 필드의 이름 ex)seq
counterSchema.statics.increment = function (name, callback) {

    return this.findByIdAndUpdate(
      name,
      { $inc: { next: 1 } },
      { new: true, upsert: true, select: { next: 1 } },
      callback
    );
};

module.exports = mongoose.model('counter', counterSchema);
