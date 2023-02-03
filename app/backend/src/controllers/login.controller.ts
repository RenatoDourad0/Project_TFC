import { Request, Response } from 'express';

export default class LoginController {
  getRole = (req:Request, res:Response) => {
    const { role } = req.body.user;
    return res.status(200).json({ role });
  };
}
