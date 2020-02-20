function handleSuccess(res, response) {
  const { status = 200, message, data } = response;

  res.status(status).json({
    message,
    data,
  });
}

module.exports = handleSuccess;
