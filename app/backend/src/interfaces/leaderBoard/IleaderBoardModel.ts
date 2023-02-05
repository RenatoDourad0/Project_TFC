export interface Iteam {
  name: string;
  totalGames: number;
}

export interface IGame {
  totalPoints: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

export interface ILeaderBoard extends Iteam, IGame {}

export default interface ILeaderBoardModel {
  getClassifications(type: string): Promise<ILeaderBoard[]>
}
