import { Router } from 'express';
import { LoginController } from '../controllers';
import { Authentication } from '../middlewares';

const loginRouter = Router();
const Auth = new Authentication();
const controller = new LoginController();

loginRouter.get('/', (_req, res) => res.status(200).json('ok!'));

loginRouter.post(
  '/',
  (req, res, next) => Auth.authenticate(req, res, next),
);

loginRouter.get(
  '/validate',
  (req, res, next) => Auth.validate(req, res, next),
  (req, res) => controller.getRole(req, res),
);

export default loginRouter;
