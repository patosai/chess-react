import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.error(err.stack);
  res.status(500).json({"error": err.toString()});
}
