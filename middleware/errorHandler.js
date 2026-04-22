function errorHandler(err, req, res, next) {
  console.error("🔥 GLOBAL ERROR HANDLER:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    details: err.message || "Something went wrong"
  });
}

module.exports = errorHandler;
