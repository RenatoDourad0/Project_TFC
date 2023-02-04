import { ILeaderBoard } from './IleaderBoardModel';

export default interface ILeaderBoardService {
  getClassifications(): Promise<ILeaderBoard[]>
}
