function errorHandler(error, request, response, next) {
  const { status = 500, message = "Something went wrong!" } = error;

  error.status
    ? response.status(error.status).json({ error: error.message })
    : response.status(status).json({ error: message });
}

module.exports = errorHandler;
