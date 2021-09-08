const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  resourceId: {
    type: String,
    required: true,
  },
  bookingId: {
    type: String,
  },
  start: {
    type: Number,
    required: true,

  },
  end: {
    type: Number,
    required: true,

  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line func-names
roomSchema.methods.toJSON = function () {
  const obj = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  delete obj.__v;
  return obj;
};

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
