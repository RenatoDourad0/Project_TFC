import { NextFunction, Request, Response } from 'express';
import { IAuthentication } from '../interfaces';
import JwtAuth from '../auth/JwtAuth';

export default class Authentication {
  constructor(private auth: IAuthentication = new JwtAuth()) {}

  public async authenticate(req: Request, res:Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await this.auth.authenticate(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  public async validate(req: Request, res:Response, next: NextFunction) {
    try {
      const token = req.header('Authorization') || '';
      const user = await this.auth.validate(token);
      req.body.user = user;
      return next();
    } catch (error) {
      next(error);
    }
  }
}
