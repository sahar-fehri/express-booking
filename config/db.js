const mongoose = require('mongoose');
require('dotenv').config();
const { info } = require('../utils/constants');

// Set up default mongoose connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(info('connected to db successfully'));
  });
const db = mongoose.connection;
module.exports = db;
