import LeaderBoardModel from '../models';
import { ILeaderBoardModel, ILeaderBoardService, ILeaderBoard } from '../interfaces';

export default class LeaderBoardService implements ILeaderBoardService {
  constructor(private model:ILeaderBoardModel = new LeaderBoardModel()) {}

  async getClassifications(type: string): Promise<ILeaderBoard[]> {
    const teams = await this.model.getClassifications(type);
    return teams;
  }

  private static fillAcc(
    totalGames: number,
    index: number,
    acc: ILeaderBoard[],
    curr: ILeaderBoard,
  ) {
    return {
      name: acc[index].name,
      totalPoints: acc[index].totalPoints + curr.totalPoints,
      totalGames: acc[index].totalGames + curr.totalGames,
      totalVictories: acc[index].totalVictories + curr.totalVictories,
      totalDraws: acc[index].totalDraws + curr.totalDraws,
      totalLosses: acc[index].totalLosses + curr.totalLosses,
      goalsFavor: acc[index].goalsFavor + curr.goalsFavor,
      goalsOwn: acc[index].goalsOwn + curr.goalsOwn,
      goalsBalance: acc[index].goalsBalance + curr.goalsBalance,
      efficiency: '',
    };
  }
  // const eff = this.str.totalPoints / (games.length * 3);
  // this.str.efficiency = `${(eff * 100).toFixed(2)}`; return '';

  async getGenericsClassifications(): Promise<ILeaderBoard[]> {
    const homeGames = await this.model.getClassifications('home');
    const awayGames = await this.model.getClassifications('away');
    const games = [...homeGames, ...awayGames];
    const teams = games.reduce((acc: ILeaderBoard[], curr: ILeaderBoard) => {
      if (acc.some((e) => e.name === curr.name)) {
        const index = acc.findIndex((e) => e.name === curr.name);
        const totalGames = games.filter((e) => e.name === curr.name).length;
        acc[index] = LeaderBoardService.fillAcc(totalGames, index, acc, curr);
        return acc;
      }
      acc.push(curr); return acc;
    }, []);
    teams.map((team) => {
      const teamWithEff = team;
      teamWithEff.efficiency = `${((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2)}`;
      return teamWithEff;
    });
    return LeaderBoardModel.sortGames(teams);
  }
}
