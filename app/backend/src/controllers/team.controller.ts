import { NextFunction, Request, Response } from 'express';
// import Team from '../database/models/Team.model';
import { TeamService } from '../services';
// import { Icontroller } from '../interfaces';

export default class TeamController {
  constructor(private service = new TeamService()) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await this.service.getAll();
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }

  // getById(id: number): T;
  // create(): T;
  // update(): T;
  // delete(): void;
}
