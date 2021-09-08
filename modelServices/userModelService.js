const User = require('../models/User');

async function findByEmail(email) {
  const result = await User.findOne({ email });
  return result;
}

async function findById(id) {
  const user = await User.findById(id);
  return user;
}

async function countDocs() {
  const num = await User.countDocuments();
  return num;
}

async function deleteMany() {
  const result = await User.deleteMany({});
  return result;
}

function createUser(userObject) {
  return new User(userObject);
}

module.exports = {
  findByEmail,
  findById,
  countDocs,
  deleteMany,
  createUser,
};
