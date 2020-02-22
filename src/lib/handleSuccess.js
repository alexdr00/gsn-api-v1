function handleSuccess(res, responsePayload) {
  const { status = 200, message, data } = responsePayload;

  res.status(status).json({
    message,
    data,
  });
}

module.exports = handleSuccess;
