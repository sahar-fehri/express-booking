const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

const compile = () => {
  try {
    // build path where compiled contract will save
    const buildPath = path.resolve(__dirname, './build');

    // remove the build folder if it exist
    fs.removeSync(buildPath);

    // path of the Smart Contract
    const contractPath = path.resolve(__dirname, './contracts', 'RoomBooking.sol');

    // Read the Smart Contract
    const source = fs.readFileSync(contractPath, 'utf8');

    // Compile the smart contract
    //  const output = solc.compile(source, 1).contracts[":Message"];
    const input = {
      language: 'Solidity',
      sources: {
        'RoomBooking.sol': {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode'],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Create the build folder if it not exist
    fs.ensureDirSync(buildPath);

    // Save the output in json format
    fs.outputJSONSync(path.resolve(buildPath, 'RoomBooking.json'), output);

    return 'Contract RoomBooking compiled successfully!';
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = compile;
