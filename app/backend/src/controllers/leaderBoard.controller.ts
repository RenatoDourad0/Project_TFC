import { Request, Response, NextFunction } from 'express';
import { LeaderBoardService } from '../services';
import { ILeaderBoardService } from '../interfaces';

export default class LeaderBoardController {
  constructor(private service:ILeaderBoardService = new LeaderBoardService()) {}

  async getClassifications(req:Request, res:Response, _next:NextFunction) {
    const teams = await this.service.getClassifications();
    res.status(200).json(teams);
  }
}
