import { NextFunction, Request, Response, Router } from 'express';
import { Authentication } from '../middlewares';
import Team from '../database/models/Team.model';
import TeamService from '../services/team.service';

const teamRouter = Router();
const auth = new Authentication();
const teamService = new TeamService(Team);

teamRouter.get(
  '/',
  (req, res, next) => auth.validate(req, res, next),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const teams = await teamService.getAll();
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  },
);

export default teamRouter;
