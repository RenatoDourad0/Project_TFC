import { Router } from 'express';
import validateRole from '../controllers/login.controller';
import { authenticate, validate } from '../middlewares/index';

const loginRouter = Router();

loginRouter.post('/', authenticate);
loginRouter.get('/validate', validate, validateRole);

export default loginRouter;
