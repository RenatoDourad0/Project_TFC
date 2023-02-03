import { Router } from 'express';
// import { Authentication } from '../middlewares';
import Match from '../database/models/Match.model';
import { MatchService } from '../services';
import { MatchController } from '../controllers';

const matchRouter = Router();
// const auth = new Authentication();
const service = new MatchService(Match);
const controller = new MatchController(service);

matchRouter.get(
  '/',
  (req, res, next) => controller.getAllOrByProgress(req, res, next),
);

matchRouter.post(
  '/',
  // (req, res, next) => auth.validate(req, res, next),
  (req, res, next) => controller.create(req, res, next),
);

matchRouter.patch(
  '/:id/finish',
  (req, res, next) => controller.updateProgressStatus(req, res, next),
);

matchRouter.patch(
  '/:id',
  (req, res, next) => controller.update(req, res, next),
);

export default matchRouter;
