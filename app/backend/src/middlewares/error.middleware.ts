import { Request, Response, NextFunction } from 'express';
import HttpException from '../errors/HttpException';

function errorMiddleware(
  err: (HttpException),
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(`Status: ${err.status} --- Message: ${err.message} 
  ----
  ${err.stack}`);
  return res.status(err.status || 500).json({ message: err.message });
}

export default errorMiddleware;
