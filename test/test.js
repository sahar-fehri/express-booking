/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const User = require('../models/User');
const Room = require('../models/Room');

const { assert } = chai;
const { expect } = chai;

// Configure chai
chai.use(chaiHttp);
chai.should();

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const user1input = {
  name: 'John Wick',
  email: 'john@wick.com',
  password: 'secret',
  company: 'cola',
};

const user2input = {
  name: 'Will Smith',
  email: 'will@smith.com',
  password: 'secret',
  company: 'cola',
};

const user3input = {
  name: 'Tom Hanks',
  email: 'tom@hanks.com',
  password: 'secret',
  company: 'pepsi',
};

const resource1 = {
  resource: 0,
  from: 8,
  to: 9,
};

const resource2 = {
  resource: 0,
  from: 9,
  to: 10,
};

const resource3 = {
  resource: 0,
  from: 9,
  to: 11,
};

const resource4 = {
  resource: 9,
  from: 9,
  to: 11,
};

const resource5 = {
  resource: 10,
  from: 12,
  to: 13,
};

const availableResource = {
  resource: 10,
  from: 9,
  to: 10,
};
let token1;
let token2;
let token3;

describe('App basic tests', () => {
  before(async () => { // waiting for contract deployment
    await timeout(1000);
    await User.deleteMany({});
    await Room.deleteMany({});
  });

  it('Should exists', () => {
    expect(app).to.be.a('function');
  });
});

describe('User register', () => {
  it('it should register user1', async () => {
    const results = await registerUsr(user1input);
    results.should.have.status(201);
    results.body.should.be.a('object');
    results.body.data.should.have.property('name');
    results.body.data.should.have.property('email');
    results.body.data.should.have.property('company');
    results.body.data.should.have.property('address');
  });

  it('it should fail to register user1', async () => {
    const results = await registerUsr(user1input);
    results.should.have.status(409);
    results.body.should.be.a('object');
    expect(results.body.errortext).to.be.equal('Email already exists');
  });
});

describe('User login', () => {
  it('it should login user1', async () => {
    const results = await loginUser(user1input);
    results.should.have.status(200);
    results.body.should.be.a('object');
    token1 = results.body.data.token;
    results.body.data.should.have.property('token');
    results.body.data.should.have.property('token');
    results.body.data.user.should.have.property('name');
    results.body.data.user.should.have.property('email');
    results.body.data.user.should.have.property('company');
    results.body.data.user.should.have.property('address');
  });
});

describe('Room book', () => {
  it('it should fail to book without token', async () => {
    const results = await book(resource1, '');
    results.should.have.status(401);
    expect(results.body.errortext).to.be.equal('Access denied');
  });

  it('it should fail to book without token', async () => {
    const results = await book(resource1, 'eyk');
    results.should.have.status(400);
    expect(results.body.errortext).to.be.equal('INVALID Token');
  });

  it('it should book successfully resource1 for user1', async () => {
    const results = await book(resource1, token1);
    results.should.have.status(200);
    results.body.data.should.have.property('resourceId');
    results.body.data.should.have.property('start');
    results.body.data.should.have.property('end');
    results.body.data.should.have.property('company');
    results.body.data.should.have.property('status');
    results.body.data.should.have.property('bookingId');
    expect(results.body.data.status).to.be.equal('booked');
  });

  it('it should fail to book resource1 again for user1', async () => {
    const results = await book(resource1, token1);
    results.should.have.status(400);
    expect(results.body.errortext).to.be.equal('Already booked');
  });

  it('it should book successfully resource2 for user1', async () => {
    const results = await book(resource2, token1);
    results.should.have.status(200);
    results.body.data.should.have.property('resourceId');
    results.body.data.should.have.property('start');
    results.body.data.should.have.property('end');
    results.body.data.should.have.property('company');
    results.body.data.should.have.property('status');
    results.body.data.should.have.property('bookingId');
    expect(results.body.data.status).to.be.equal('booked');
  });

  it('it should fail to book resource3 again for user1', async () => {
    const results = await book(resource3, token1);
    results.should.have.status(400);
    expect(results.body.errortext).to.be.equal('Slot Already Booked');
  });

  it('it should book successfully for user3 resource4', async () => {
    await registerUsr(user3input);
    const resultLogin = await loginUser(user3input);
    token3 = resultLogin.body.data.token;
    const results = await book(resource4, token3);
    results.should.have.status(200);
    results.body.data.should.have.property('resourceId');
    results.body.data.should.have.property('start');
    results.body.data.should.have.property('end');
    results.body.data.should.have.property('company');
    results.body.data.should.have.property('status');
    results.body.data.should.have.property('bookingId');
    expect(results.body.data.status).to.be.equal('booked');
  });
});

describe('Room cancel', () => {
  it('it Should fail to cancel a slot that was never booked by user1', async () => {
    const results = await cancel(availableResource, token1);
    results.should.have.status(409);
    expect(results.body.errortext).to.be.equal('This resource is not booked');
  });

  it('Should fail to cancel resource4 that is booked by user3 from user1 account', async () => {
    const results = await cancel(resource4, token1);
    results.should.have.status(400);
    expect(results.body.errortext).to.be.equal('You did not book this slot');
  });

  it('it should cancel successfully resource1 for user1', async () => {
    const results = await cancel(resource1, token1);
    results.should.have.status(200);
    results.body.data.should.have.property('resourceId');
    results.body.data.should.have.property('start');
    results.body.data.should.have.property('end');
    results.body.data.should.have.property('company');
    results.body.data.should.have.property('status');
    results.body.data.should.have.property('bookingId');
    expect(results.body.data.status).to.be.equal('available');
  });
});

describe('Room availibility', () => {
  it('Should book resource by user1 then find it in getAvailibilities array', async () => {
    await book(resource5, token1);
    const results = await getAvailibilities(token1);
    const found = results.body.data.find((element) => element.resourceId === '10');
    expect(found.status).to.be.equal('booked');
  });
});

function registerUsr(usr) {
  return new Promise((resolve) => {
    chai.request(app)
      .post('/api/register')
      .send(usr)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        throw err;
      });
  });
}

function loginUser(usr) {
  return new Promise((resolve) => {
    chai.request(app)
      .post('/api/login')
      .send({
        email: usr.email,
        password: usr.password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        throw err;
      });
  });
}

function book(room, token) {
  return new Promise((resolve) => {
    chai.request(app)
      .post('/api/room/book')
      .set('auth-token', token)
      .send(room)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        throw err;
      });
  });
}

function cancel(room, token) {
  return new Promise((resolve) => {
    chai.request(app)
      .post('/api/room/cancel')
      .set('auth-token', token)
      .send(room)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        throw err;
      });
  });
}

function getAvailibilities(token) {
  return new Promise((resolve) => {
    chai.request(app)
      .get('/api/room/availibilities')
      .set('auth-token', token)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        throw err;
      });
  });
}
