import { Router } from 'express';
import { validate } from '../middlewares/index';

const userRouter = Router();

userRouter.get('/', validate);

export default userRouter;
