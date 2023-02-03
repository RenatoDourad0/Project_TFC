import { Router } from 'express';
import { Authentication } from '../middlewares';

const Auth = new Authentication();
const userRouter = Router();

userRouter.get('/', (req, res, next) => Auth.validate(req, res, next));

export default userRouter;
