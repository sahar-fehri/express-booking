const fs = require('fs-extra');
const path = require('path');
const circularJSON = require('circular-json');
const WebProvider = require('../config/provider');

const { web3 } = new WebProvider().getInstance();
const web3Network = 'ganache';
const myContractInstance = require('../config/contract');

const { blue } = require('../utils/constants');

const deploy = async () => {
  // eslint-disable-next-line global-require
  const compiledContract = require('./build/RoomBooking.json');

  try {
    // set the receipt path
    const receiptPath = path.resolve('ethereum', `receipt-${web3Network}.json`);
    console.log(`---------- receipt path -------- ${receiptPath}`);
    // deploying the contract with accounts[0]
    const accounts = await web3.eth.getAccounts();
    console.log(blue(`Attempting to deploy from account , ${accounts[0]}`));
    const roomBooking = compiledContract.contracts['RoomBooking.sol'].RoomBooking;

    const { abi } = roomBooking;
    const bytecode = `0x${roomBooking.evm.bytecode.object}`;
    const cola = web3.utils.asciiToHex('cola').padEnd(66, '0');
    const pepsi = web3.utils.asciiToHex('pepsi').padEnd(66, '0');
    const result = await new web3.eth.Contract(
      JSON.parse(JSON.stringify(abi)), null, {
        data: bytecode,
      },
    )
      .deploy({
        arguments: [10, cola, pepsi],
      })
      .send({ gas: 3000000, from: accounts[0] });

    console.log(blue(`Contract deployed to ${result.options.address}`));

    // CircularJson is converting nested object into string which can be then saved as json
    const serialised = circularJSON.stringify(result.options);
    // save the receipt address in receipt path
    await fs.writeJson(receiptPath, result.options);
    myContractInstance.abi = abi;
    myContractInstance.address = result.options.address;
    return serialised;
  } catch (error) {
    console.log('errrrrr', error);
    console.log(error(error));
    return error;
  }
};

module.exports = deploy;
