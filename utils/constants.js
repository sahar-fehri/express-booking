const chalk = require('chalk');

const error = chalk.bold.red;
const info = chalk.bold.green;
const { blue } = chalk.bold;
const warning = chalk.hex('#FFA500'); // Orange color
const yellow = chalk.hex('#ffff00');
const Status = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
};

module.exports = {
  error, info, warning, blue, yellow, Status,
};
