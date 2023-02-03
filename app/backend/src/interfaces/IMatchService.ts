import { ModelAttributes } from 'sequelize';
import Match from '../database/models/Match.model';

export default interface IMatchService {
  getAll(): Promise<Match[]>;
  getAllByProgress(inProglress: boolean): Promise<Match[]>;
  create(match:Exclude<ModelAttributes<Match>, ['id', 'inProgress']>, token:string): Promise<Match>;
  updateProgressStatus(id: number): Promise<boolean>;
  update(id: number, newData: { homeTeamGoals: number, awayTeamGoals: number }):Promise<boolean>;
}
