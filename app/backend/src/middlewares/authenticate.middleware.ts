import { NextFunction, Request, Response } from 'express';
import auth from '../auth/authenticate';

export default async function authenticate(req: Request, res:Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const token = await auth(email, password);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}
