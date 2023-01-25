import { Request, Response, NextFunction } from 'express';

const loginUnfilledFieldsError = 'All fields must be filled';
const validationError = 'Incorrect email or password';

function errorMiddleware(err:Error, _req:Request, res:Response, _next:NextFunction) {
  console.error(err.stack);
  switch (err.message) {
    case (loginUnfilledFieldsError):
      return res.status(400).json({ message: loginUnfilledFieldsError });
    case ('Token not found'):
      return res.status(400).json({ message: loginUnfilledFieldsError });
    case (validationError):
      return res.status(401).json({ message: validationError });
    case ('jwt malformed'):
      return res.status(401).json({ message: validationError });
    case ('invalid token'):
      return res.status(401).json({ message: validationError });
    default:
      return res.status(500).json({ message: `Algo deu errado! Mensagem: ${err.message}` });
  }
}

export default errorMiddleware;
