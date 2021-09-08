/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const { soliditySha3 } = require('web3-utils');
const verify = require('../verifyToken');
const Utils = require('../utils/utils');
const { blue, info } = require('../utils/constants');

const BookService = require('../services/bookService');
const RoomModelService = require('../modelServices/roomModelService');
const UserModelService = require('../modelServices/userModelService');

const getComputedHash = (resource, from, to) => {
  const soliditySha3Expected = soliditySha3(
    resource,
    from,
    to,
  );
  const bn = BigInt(soliditySha3Expected);
  return bn.toString();
};

router.get('/availabilities', verify.verifyToken, async (req, res) => {
  try {
    const result = await RoomModelService.getAllAvailibilities();
    return Utils.getJsonResponse('ok', 200, '', result, res);
  } catch (err) {
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/book', verify.verifyToken, async (req, res) => {
  const user = await UserModelService.findById(req.user._id);
  try {
    const { resource, from, to } = req.body;
    console.log(blue('Attempt to book a room'));
    const result = await BookService.book(resource, from, to, user);
    return Utils.getJsonResponse('ok', 200, '', result, res);
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/cancel', verify.verifyToken, async (req, res) => {
  const user = await UserModelService.findById(req.user._id);
  try {
    const { resource, from, to } = req.body;
    const computedBookingId = getComputedHash(resource, from, to);
    console.log(info(`Received cancel request for this bookingId ${computedBookingId}`));
    const room = await RoomModelService.findOneByBookingId(computedBookingId);
    if (!room) {
      return Utils.getJsonResponse('error', 409, 'This resource is not booked', '', res);
    }
    const result = await BookService.cancel(user, computedBookingId);
    return Utils.getJsonResponse('ok', 200, '', result, res);
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

module.exports = router;
