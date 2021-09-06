module.exports = {
  getJsonResponse: (status, errorcode, errortext, data, res) => {
    res.status(errorcode).json({
      status,
      errorcode,
      errortext,
      data,
    });
  },
};
