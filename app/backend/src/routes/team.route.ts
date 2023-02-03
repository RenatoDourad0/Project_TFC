import { Router } from 'express';
// import { Authentication } from '../middlewares';
import Team from '../database/models/Team.model';
import { TeamService } from '../services';
import { TeamController } from '../controllers';

const teamRouter = Router();
// const auth = new Authentication();
const service = new TeamService(Team);
const controller = new TeamController(service);

teamRouter.get(
  '/',
  (req, res, next) => controller.getAll(req, res, next),
);

teamRouter.get(
  '/:id',
  (req, res, next) => controller.getById(req, res, next),
);

export default teamRouter;
