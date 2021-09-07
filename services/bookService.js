const WebProvider = require('../config/provider');
const Room = require('../models/Room');
const { Status, error } = require('../utils/constants');

const { web3 } = new WebProvider().getInstance();
const instanceContract = require('../config/contract');
// eslint-disable-next-line max-len
const getBookingContract = () => new web3.eth.Contract(instanceContract.abi, instanceContract.address);

function book(resource, from, to, user) {
  return new Promise((resolve, reject) => {
    const room = new Room({
      resourceId: resource,
      start: from,
      end: to,
      company: user.company,
      status: Status.BOOKED,
    });
    const userCompany = web3.utils.asciiToHex(user.company).padEnd(66, '0');
    try {
      // const instance = new web3.eth.Contract(instanceContract.abi, instanceContract.address);
      getBookingContract().methods.book(resource, from, to, userCompany)
        .send({ from: user.address, gas: 3000000 })
        .on('receipt', async (receipt) => {
          if (!receipt.events.ShowBookingId) {
            console.log(error('event for booking id not found'));
            reject(new Error('Booking error'));
          }
          room.bookingId = receipt.events.ShowBookingId.returnValues.id;
          const savedRoom = await room.save();
          resolve(savedRoom);
        })
        .on('error', async (errr) => {
          if (errr.data) {
            const obj = errr.data;
            const resonError = obj[Object.keys(obj)[0]];
            reject(resonError.reason);
          }
          reject(errr);
        });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

function cancel(user, computedBookingId) {
  return new Promise((resolve, reject) => {
    const userCompany = web3.utils.asciiToHex(user.company).padEnd(66, '0');
    try {
      getBookingContract().methods.cancel(computedBookingId, userCompany)
        .send({ from: user.address, gas: 3000000 })
        .on('receipt', async (receipt) => {
          if (!receipt.events.Canceled) {
            console.log(error('event for cancel id not found'));
            reject(new Error('Cancel Error'));
          }
          const resultCancel = await Room.cancelRoom(computedBookingId);
          resolve(resultCancel);
        })
        .on('error', async (errr) => {
          if (errr.data) {
            const obj = errr.data;
            const resonError = obj[Object.keys(obj)[0]];
            reject(resonError.reason);
          }
          reject(errr);
        });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

module.exports = {
  book,
  cancel,
};
