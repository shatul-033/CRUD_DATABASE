const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
};

module.exports = { notFound, errorHandler };
