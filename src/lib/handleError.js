const any = require('../helpers/any');
const errorMessages = require('../constants/errorsMessages');

function handleError(res, error) {
  const isJoiError = error.isJoi;
  const badRequestConditions = [
    isJoiError,
  ];
  if (any(badRequestConditions)) {
    const badRequestError = makeBadRequestError();
    return res.status(400).json({ error: badRequestError });
  }

  const isAuthError = error.code === 'NotAuthorizedException';
  const authErrorConditions = [
    isAuthError,
  ];
  if (any(authErrorConditions)) {
    const notAuthorizedError = makeUnauthorizedError();
    return res.status(401).json({ error: notAuthorizedError });
  }

  const userExists = error.code === 'UsernameExistsException';
  const userIsNotConfirmed = error.code === 'UserNotConfirmedException';
  const forbbidenErrorConditions = [
    userExists,
    userIsNotConfirmed,
  ];
  if (any(forbbidenErrorConditions)) {
    const forbiddenError = makeForbiddenError();
    return res.status(403).json({ error: forbiddenError });
  }

  const internalError = makeInternalError();
  return res.status(500).json({ error: internalError });

  function makeUnauthorizedError() {
    const errorDetails = {
      detail: errorMessages.UNAUTHORIZED_ERROR,
      statusCode: 401,
      status: 'Unauthorized',
    };
    return makeError(errorDetails);
  }

  function makeBadRequestError() {
    const errorDetails = {
      detail: errorMessages.BAD_REQUEST_ERROR,
      statusCode: 400,
      status: 'Bad Request',
    };

    if (isJoiError) {
      const joiDetails = mapJoiErrorDetails(error);
      errorDetails.joiDetails = joiDetails;
    }

    return makeError(errorDetails);
  }

  function makeInternalError() {
    const errorDetails = {
      detail: errorMessages.INTERNAL_SERVER_ERROR,
      statusCode: 500,
      status: 'Internal Server Error',
    };
    return makeError(errorDetails);
  }

  function makeForbiddenError() {
    const errorDetails = {
      detail: errorMessages.FORBIDDEN_ERROR,
      statusCode: 403,
      status: 'Forbidden',
    };
    return makeError(errorDetails);
  }

  function makeError(errorDetails) {
    const errorShape = {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: errorDetails.statusCode,
      status: errorDetails.status,
      detail: errorDetails.detail,
      validationMessages: errorDetails.joiDetails,
    };
    return errorShape;
  }
}

function mapJoiErrorDetails(error) {
  const errorDetails = error.details;
  return errorDetails.map((errorDetail) => errorDetail.message);
}


module.exports = handleError;
