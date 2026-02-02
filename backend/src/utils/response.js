const success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const error = (
  res,
  message = "Something went wrong",
  status = 400,
  extra = null
) => {
  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && extra && { extra }),
  });
};

module.exports = { success, error };
