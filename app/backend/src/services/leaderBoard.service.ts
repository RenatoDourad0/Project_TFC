import LeaderBoardModel from '../models';
import { ILeaderBoardModel, ILeaderBoardService, ILeaderBoard } from '../interfaces';

export default class LeaderBoardService implements ILeaderBoardService {
  constructor(private model:ILeaderBoardModel = new LeaderBoardModel()) {}

  async getClassifications(type: string): Promise<ILeaderBoard[]> {
    const teams = await this.model.getClassifications(type);
    return teams;
  }
}
