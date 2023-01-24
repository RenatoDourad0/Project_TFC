import { Request, Response } from 'express';

const validateRole = (req:Request, res:Response) => {
  const { role } = req.body.user;
  return res.status(200).json({ role });
};

export default validateRole;
