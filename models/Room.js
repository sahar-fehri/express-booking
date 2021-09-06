const mongoose = require('mongoose');
const { Status } = require('../utils/constants');

const { Schema } = mongoose;
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

roomSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;

module.exports.getAllAvailibilities = async () => {
  const result = await Room.find({ status: Status.BOOKED });
  return result;
};

module.exports.cancelRoom = async (bookingId) => {
  const query = { bookingId };
  const newvalues = { $set: { status: Status.AVAILABLE } };
  const result = await Room.findOneAndUpdate(query, newvalues, { new: true });
  return result;
};

module.exports.isBooked = async (idSlot, status, idCompany) => {
  const query = { company: idCompany, status, idSlot };
  const res = await Room.find(query);
  return res.length !== 0;
};
