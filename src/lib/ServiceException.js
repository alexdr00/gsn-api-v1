class ServiceException extends Error {
  constructor(error, name) {
    super(error);
    this.name = name;
    this.message = error.message;
    this.code = error.code;
  }
}

module.exports = ServiceException;
