module.exports = (error, req, res, next) => {
  const { statusCode = 500, message = 'An error occurred' } = error;

  res.status(statusCode).json({ message });

  return next(error);
};
