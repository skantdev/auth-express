export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode ?? 500).json({
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: error.statusCode ? error.message : 'Internal server error'
    }
  });
};
