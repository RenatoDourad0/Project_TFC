import { NextFunction, Request, Response } from 'express';
import { ITeamService } from '../interfaces';
// import Team from '../database/models/Team.model';
import { TeamService } from '../services';
// import { Icontroller } from '../interfaces';

export default class TeamController {
  constructor(private service: ITeamService = new TeamService()) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await this.service.getAll();
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const team = await this.service.getById(Number(id));
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  // create(): T;
  // update(): T;
  // delete(): void;
}
