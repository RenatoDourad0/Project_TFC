import { Router } from 'express';
// import { Authentication } from '../middlewares';
import LeaderBoardModel from '../models';
import { LeaderBoardService } from '../services';
import { LeaderBoardController } from '../controllers';

const leaderBoardRouter = Router();
// const auth = new Authentication();
const model = new LeaderBoardModel();
const service = new LeaderBoardService(model);
const controller = new LeaderBoardController(service);

leaderBoardRouter.get(
  '/',
  (req, res, next) => controller.getGenericClassifications(req, res, next),
);

leaderBoardRouter.get(
  '/home',
  (req, res, next) => controller.getClassifications(req, res, next),
);

leaderBoardRouter.get(
  '/away',
  (req, res, next) => controller.getClassifications(req, res, next),
);

export default leaderBoardRouter;
