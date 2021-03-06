/* eslint-disable no-plusplus */
require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const connection = require('./config/db');
const compile = require('./ethereum/compiler');
const deploy = require('./ethereum/deployer');
const UserModel = require('./models/User');
const RoomModel = require('./models/Room');
const {
  info,
  blue,
  error,
  yellow,
} = require('./utils/constants');
// add swagger

const swaggerDocument = require('./swagger.json');

if (process.env.NODE_ENV === 'development') {
  swaggerDocument.host = `${process.env.SWAGGER_URL}:${process.env.PORT}`;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// todo
// add swagger spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// just for dev remove DB
connection.on('error', console.error.bind(console, 'CONNECTION ERROR'));
connection.once('open', () => {
  console.log('MongoDB connected successfully');
  connection.db.listCollections().toArray((err, names) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < names.length; i++) {
        if ((names[i].name === 'users')) {
          console.log(yellow('user Collection Exists in DB'));
          UserModel.collection.drop();
          console.log(yellow('user Collection No Longer Available'));
        } else if ((names[i].name === 'rooms')) {
          console.log(yellow('room Collection Exists in DB'));
          RoomModel.collection.drop();
          console.log(yellow('room Collection No Longer Available'));
        } else {
          console.log(yellow("Collection doesn't exist"));
        }
      }
    }
  });
});

// Importing routes
const authRoute = require('./routes/auth');
const roomRoute = require('./routes/room');

// Middlewares for routes
app.use(cors());
app.use('/api', authRoute);
app.use('/api/room', roomRoute);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(info(`server running on ${port}`));

  try {
    const resultCompilation = compile();
    console.log(info(resultCompilation));

    console.log(blue('Deploying Smart contract ... '));

    const resultDeploy = await deploy();
    console.log(info(`Deployed Smart contract successfully to ${JSON.parse(resultDeploy).address}`));
  } catch (err) {
    console.log(error(err));
  }
});

module.exports = app;
