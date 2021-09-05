/* eslint-disable max-classes-per-file */
const Web3 = require('web3');

class WebProvider {
  constructor() {
    console.log('process env url', process.env.URL);
    this.provider = new Web3.providers.WebsocketProvider(`ws://${process.env.URL}`);
    this.web3 = new Web3(this.provider);
    this.web3.setProvider(`ws://${process.env.URL}`);
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new WebProvider();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

module.exports = Singleton;
