import { HttpError } from 'http-errors';
import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.CastError && err.kind === 'ObjectId') {
    return res.status(400).json({
      status: 400,
      message: `Invalid ID format: ${err.value}`,
    });
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }

  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
