const jwt = require('jsonwebtoken');
const Utils = require('./utils/utils');

// middleware fct to protect our private routes
// eslint-disable-next-line consistent-return
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) return Utils.getJsonResponse('error', 401, 'Access denied', '', res);

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      return Utils.getJsonResponse('error', 400, 'INVALID Token', '', res);
    }
  } else {
    return Utils.getJsonResponse('error', 401, 'Access denied', '', res);
  }
}

module.exports = {
  verifyToken,
};
