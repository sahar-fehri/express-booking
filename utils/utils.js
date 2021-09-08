module.exports = {
  getJsonResponse: (status, code, errortext, data, res) => {
    res.status(code).json({
      status,
      code,
      errortext,
      data,
    });
  },
};
