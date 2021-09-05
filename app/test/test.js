/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const RoomBooking = artifacts.require('RoomBooking');
const {
  BN,
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const cola = web3.utils.asciiToHex('cola').padEnd(66, '0');
const pepsi = web3.utils.asciiToHex('pepsi').padEnd(66, '0');

contract('RoomBooking', (accounts) => {
  let booking;
  const user1Cola = accounts[0];
  const user2Cola = accounts[1];
  const user1Pepsi = accounts[2];
  const user2Pepsi = accounts[3];
  let numOfSuccessfulBookings = 0;

  before('setup contract', async () => {
    booking = await RoomBooking.new(2, cola, pepsi);
  });

  it('Should book successfully room id 0 from 8 to 9 for user1Cola', async () => {
    const receipt = await booking.book(0, 8, 9, cola, { from: user1Cola });
    numOfSuccessfulBookings++;
    expectEvent(receipt, 'Booked', {
      idRoom: new BN(0),
      from: new BN(8),
      to: new BN(9),
      company: cola,
    });
  });

  it('Should fail to book room id 0 from 8 to 9 for user2Cola', async () => {
    await expectRevert(
      booking.book(0, 8, 9, cola, { from: user2Cola }),
      'Already booked',
    );
  });

  it('Should book successfully room id 9 from 11 to 12 for user2Cola', async () => {
    const receipt = await booking.book(9, 11, 12, cola, { from: user1Cola });
    numOfSuccessfulBookings++;
    expectEvent(receipt, 'Booked', {
      idRoom: new BN(9),
      from: new BN(11),
      to: new BN(12),
      company: cola,
    });
  });

  it('Should fail to book room id 9 from 8 to 9 for user2Cola', async () => {
    await expectRevert(
      booking.book(9, 8, 9, cola, { from: user2Cola }),
      'This company has reached reservation limit',
    );
  });

  it('Should fail to book room id 0 from 8 to 9 for user1Pepsi', async () => {
    await expectRevert(
      booking.book(0, 8, 9, pepsi, { from: user1Pepsi }),
      'Already booked',
    );
  });

  it('Should book successfully room id 0 from 9 to 10 for user1Pepsi', async () => {
    const receipt = await booking.book(0, 9, 10, pepsi, { from: user1Pepsi });
    numOfSuccessfulBookings++;
    expectEvent(receipt, 'Booked', {
      idRoom: new BN(0),
      from: new BN(9),
      to: new BN(10),
      company: pepsi,
    });
  });

  it('Should fail to book room id 0 from 9 to 12 for user1Pepsi', async () => {
    await expectRevert(
      booking.book(0, 9, 12, pepsi, { from: user1Pepsi }),
      'Slot Already Booked',
    );
  });

  it('Should fail to cancel room id 0 from 9 to 10 for user2Pepsi', async () => {
    const lastBooked = await booking.arrayBookingIds(numOfSuccessfulBookings - 1);

    await expectRevert(
      booking.cancel(lastBooked, pepsi, { from: user2Pepsi }),
      'You did not book this slot',
    );
  });

  it('Should cancel successfully room id 0 from 9 to 10 for user1Pepsi', async () => {
    const lastBooked = await booking.arrayBookingIds(numOfSuccessfulBookings - 1);
    const receipt = await booking.cancel(lastBooked, pepsi, { from: user1Pepsi });

    expectEvent(receipt, 'Canceled', {
      idRoom: new BN(0),
      from: new BN(9),
      to: new BN(10),
      company: pepsi,
    });
  });

  it('Should be able to book successfully again room id 0 from 9 to 10 for user1Pepsi', async () => {
    const receipt = await booking.book(0, 9, 10, pepsi, { from: user1Pepsi });
    numOfSuccessfulBookings++;
    expectEvent(receipt, 'Booked', {
      idRoom: new BN(0),
      from: new BN(9),
      to: new BN(10),
      company: pepsi,
    });
  });
});
