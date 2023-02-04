import { ModelStatic } from 'sequelize';
import { ILeaderBoard, ILeaderBoardModel } from '../interfaces';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';
// import { MatchService, TeamService } from '../services';

export default class LeaderBoardModel implements ILeaderBoardModel {
  constructor(
    private team:ModelStatic<Team> = Team,
    private match:ModelStatic<Match> = Match,
  ) {}

  private str = {
    totalPoints: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '',
  };

  private getTeamInfo(team: any) {
    const shape = {
      name: team.teamName,
      totalGames: team.homeTeamId.length,
    };
    const ret = this.getGamesInfo(team.homeTeamId, shape.totalGames);
    const data = { ...shape, ...ret };
    this.str = {
      totalPoints: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '',
    };
    return data;
  }

  private getGamesInfo(games: any, totalGames: number) {
    games.map((game: any) => {
      if (game.homeTeamGoals > game.awayTeamGoals) {
        this.str.totalPoints += 3;
        this.str.totalVictories += 1;
      }
      if (game.homeTeamGoals === game.awayTeamGoals) {
        this.str.totalPoints += 1;
        this.str.totalDraws += 1;
      }
      if (game.homeTeamGoals < game.awayTeamGoals) this.str.totalLosses += 1;
      this.str.goalsFavor += game.homeTeamGoals;
      this.str.goalsOwn += game.awayTeamGoals;
      this.str.goalsBalance = this.str.goalsFavor - this.str.goalsOwn;
      const eff = this.str.totalPoints / (totalGames * 3);
      this.str.efficiency = `${(eff * 100).toFixed(2)}`;
      return undefined;
    });
    return this.str;
  }

  public async getClassifications(): Promise<ILeaderBoard[]> {
    const teams = await this.team.findAll({
      include: { model: Match, as: 'homeTeamId', where: { inProgress: false } },
    }) as any[];

    const reduced = teams.map((team) => this.getTeamInfo(team));

    return reduced.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalVictories > b.totalVictories) return -1;
      if (a.totalVictories < b.totalVictories) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      if (a.goalsOwn > b.goalsOwn) return 1;
      if (a.goalsOwn < b.goalsOwn) return -1;
      return 0;
    });
  }
}
