/* eslint-disable no-undef */
const Migrations = artifacts.require('Migrations');

const SimpleStorage = artifacts.require('SimpleStorage');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(SimpleStorage);
};
