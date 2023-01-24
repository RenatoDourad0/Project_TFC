import { NextFunction, Request, Response } from 'express';
import valid from '../auth/validate';

export default async function validate(req: Request, res:Response, next: NextFunction) {
  try {
    const token = req.header('Authorization') || '';
    const user = await valid(token);
    req.body.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
