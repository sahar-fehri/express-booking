const router = require('express').Router();
const verify = require('../verifyToken');
const User = require('../models/User');
const Room = require('../models/Room');
const Utils = require('../utils/utils');
const {
  blue, info, error, Status,
} = require('../utils/constants');
const WebProvider = require('../config/provider');

const { web3 } = new WebProvider().getInstance();
const instanceContract = require('../config/contract');

const { soliditySha3 } = require('web3-utils');

// eslint-disable-next-line max-len
const getBookingContract = () => new web3.eth.Contract(instanceContract.abi, instanceContract.address);

router.get('/availibilities', verify, async (req, res) => {
  try {
    const result = await Room.getAllAvailibilities();
    return Utils.getJsonResponse('ok', 200, '', result, res);
  } catch (err) {
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/book', verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const { resource, from, to } = req.body;
    console.log(blue('Attempt to book a room'));
    const room = new Room({
      resourceId: resource,
      start: from,
      end: to,
      company: user.company,
      status: Status.BOOKED,
    });
    console.log(info(`Received booking request for this for this recource ${resource}`));
    const userCompany = web3.utils.asciiToHex(user.company).padEnd(66, '0');
    getBookingContract().methods.book(resource, from, to, userCompany)
      .send({ from: user.address, gas: 3000000 })
      .on('receipt', async (receipt) => {
        if (!receipt.events.ShowBookingId) {
          console.log(error('event for booking id not found'));
          return Utils.getJsonResponse('error', 400, 'Booking error', '', res);
        }
        room.bookingId = receipt.events.ShowBookingId.returnValues.id;
        const savedRoom = await room.save();
        return Utils.getJsonResponse('ok', 200, '', savedRoom, res);
      })
      .on('error', async (errr) => {
        if (errr.data) {
          const obj = errr.data;
          const resonError = obj[Object.keys(obj)[0]];
          return Utils.getJsonResponse('error', 400, resonError.reason, '', res);
        }
        return Utils.getJsonResponse('error', 400, errr, '', res);
      });
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/cancel', verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const { resource, from, to } = req.body;
    const soliditySha3Expected = soliditySha3(
      resource,
      from,
      to,
    );
    const bn = BigInt(soliditySha3Expected);
    const computedBookingId = bn.toString();
    console.log(info(`Received cancel request for this bookingId ${computedBookingId}`));
    const userCompany = web3.utils.asciiToHex(user.company).padEnd(66, '0');

    const room = await Room.findOne({ bookingId: computedBookingId });
    if (!room) {
      return Utils.getJsonResponse('error', 409, 'This resource is not booked', '', res);
    }
    getBookingContract().methods.cancel(computedBookingId, userCompany)
      .send({ from: user.address, gas: 3000000 })
      .on('receipt', async (receipt) => {
        if (!receipt.events.Canceled) {
          console.log(error('event for cancel id not found'));
          return Utils.getJsonResponse('error', 400, 'Cancel error', '', res);
        }
        const resultCancel = await Room.cancelRoom(computedBookingId);
        return Utils.getJsonResponse('ok', 200, '', resultCancel, res);
      })
      .on('error', async (errr) => {
        if (errr.data) {
          const obj = errr.data;
          const resonError = obj[Object.keys(obj)[0]];
          return Utils.getJsonResponse('error', 400, resonError.reason, '', res);
        }
        return Utils.getJsonResponse('error', 400, errr, '', res);
      });
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

module.exports = router;
