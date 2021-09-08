const Room = require('../models/Room');
const { Status } = require('../utils/constants');

async function getAllAvailibilities() {
  const result = await Room.find({ status: Status.BOOKED });
  return result;
}

async function cancelRoom(bookingId) {
  const query = { bookingId };
  const newvalues = { $set: { status: Status.AVAILABLE } };
  const result = await Room.findOneAndUpdate(query, newvalues, { new: true });
  return result;
}

async function isBooked(idSlot, status, idCompany) {
  const query = { company: idCompany, status, idSlot };
  const res = await Room.find(query);
  return res.length !== 0;
}

async function findOneByBookingId(computedBookingId) {
  const room = await Room.findOne({ bookingId: computedBookingId });
  return room;
}

async function deleteMany() {
  const result = await Room.deleteMany({});
  return result;
}

function createRoom(roomObject) {
  return new Room(roomObject);
}

module.exports = {
  getAllAvailibilities,
  cancelRoom,
  isBooked,
  findOneByBookingId,
  deleteMany,
  createRoom,
};
