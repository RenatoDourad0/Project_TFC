import { ILeaderBoard } from './IleaderBoardModel';

export default interface ILeaderBoardService {
  getClassifications(type: string): Promise<ILeaderBoard[]>;
  getGenericsClassifications(): Promise<ILeaderBoard[]>;
}
