const router = require('express').Router();
const verify = require('../verifyToken');
const User = require('../models/User');
const Utils = require('../utils/utils');
const { blue } = require('../utils/constants');

router.get('/availibilities', verify, async (req, res) => {
  const user = await User.findById(req.user._id);

  try {
    // TODO
    console.log(blue('Attempt to view availabilities'));
    return Utils.getJsonResponse('ok', 200, '', 'ok', res);
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/book', verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    // TODO
    console.log(blue('Attempt to book a room'));
    return Utils.getJsonResponse('ok', 200, '', 'ok', res);
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

router.post('/cancel', verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    // TODO
    console.log(blue('Attempt to cancel a room'));
    return Utils.getJsonResponse('ok', 200, '', 'ok', res);
  } catch (err) {
    console.error(err);
    return Utils.getJsonResponse('error', 400, err, '', res);
  }
});

module.exports = router;
