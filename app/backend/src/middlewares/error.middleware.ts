import { Request, Response, NextFunction } from 'express';

function errorMiddleware(err:Error, _req:Request, res:Response, _next:NextFunction) {
  // console.error(err.stack);
  switch (err.message) {
    case ('All fields must be filled' || 'Token not found'):
      return res.status(400).json({ message: 'All fields must be filled' });
    case ('Incorrect email or password' || 'jwt malformed' || 'invalid token'):
      return res.status(401).json({ message: 'Incorrect email or password' });
    default:
      return res.status(500).json({ message: `Algo deu errado! Mensagem: ${err.message}` });
  }
}

export default errorMiddleware;
