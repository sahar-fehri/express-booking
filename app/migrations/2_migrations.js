// eslint-disable-next-line no-undef
const RoomBooking = artifacts.require('RoomBooking');
const WebProvider = require('../../config/provider');

const { web3 } = new WebProvider().getInstance();

module.exports = (deployer) => {
  const cola = web3.utils.asciiToHex('cola').padEnd(66, '0');
  const pepsi = web3.utils.asciiToHex('pepsi').padEnd(66, '0');
  deployer.deploy(RoomBooking, 10, cola, pepsi);
};
