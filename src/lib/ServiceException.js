class ServiceException extends Error {
  constructor(error, name) {
    super();
    Error.captureStackTrace(this, ServiceException);

    this.name = name;
    this.code = error.code;
    this.message = error.message;
    this.stack = error.stack;
    this.meta = { ...error };
  }
}

module.exports = ServiceException;
