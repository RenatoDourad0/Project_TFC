import { Request, Response, NextFunction } from 'express';
import { LeaderBoardService } from '../services';
import { ILeaderBoardService } from '../interfaces';

export default class LeaderBoardController {
  constructor(private service:ILeaderBoardService = new LeaderBoardService()) {}

  async getClassifications(req:Request, res:Response, next:NextFunction) {
    try {
      const type = req.path === '/home' ? 'home' : 'away';
      const teams = await this.service.getClassifications(type);
      res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }

  async getGenericClassifications(req:Request, res:Response, next:NextFunction) {
    try {
      const teams = await this.service.getGenericsClassifications();
      res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }
}
