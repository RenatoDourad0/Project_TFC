import { ModelAttributes } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import Match from '../database/models/Match.model';
import { IMatchService } from '../interfaces';
import { MatchService } from '../services';
import { NotFoundError } from '../errors';

export default class MatchController {
  constructor(private service: IMatchService = new MatchService()) {}

  async getAllOrByProgress(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.inProgress) {
        const { inProgress } = req.query;
        if (inProgress === 'true') {
          const matches = await this.service.getAllByProgress(true);
          return res.status(200).json(matches);
        }
        const matches = await this.service.getAllByProgress(false);
        return res.status(200).json(matches);
      }
      const matches = await this.service.getAll();
      return res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const {
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals } = req
      .body as Exclude<ModelAttributes<Match>, { id: number, inProgress: boolean }>;
    const token = req.header('Authorization') || '';
    try {
      const newMatch = await this.service.create({
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals }, token);
      return res.status(201).json(newMatch);
    } catch (error) {
      next(error);
    }
  }

  async updateProgressStatus(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const updated = await this.service.updateProgressStatus(Number(id));
      if (updated) return res.status(200).json({ message: 'Finished' });
      throw new NotFoundError('id not found');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const updated = await this.service.update(
        Number(id),
        { homeTeamGoals: homeTeamGoals as number,
          awayTeamGoals: awayTeamGoals as number },
      );
      if (updated) return res.status(200).json({ message: 'Updated' });
      throw new NotFoundError('id not found');
    } catch (error) {
      next(error);
    }
  }
}
