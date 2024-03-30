const logRequest = (req, res, next) => {
  console.log(`[${req.method}] method request on ${req.path}`);
  res.on('finish', () => {
    console.log(`Response status code: ${res.statusCode}`);
  });
  next();
}

module.exports = logRequest;