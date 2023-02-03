import { Router } from 'express';
import validateRole from '../controllers/login.controller';
import { Authentication } from '../middlewares';

const loginRouter = Router();
const Auth = new Authentication();

loginRouter.get('/', (_req, res) => res.status(200).json('ok!'));

loginRouter.post(
  '/',
  (req, res, next) => Auth.authenticate(req, res, next),
);

loginRouter.get(
  '/validate',
  (req, res, next) => Auth.validate(req, res, next),
  (req, res) => validateRole(req, res),
);

export default loginRouter;
