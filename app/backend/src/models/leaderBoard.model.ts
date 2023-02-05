import { ModelStatic } from 'sequelize';
import { IAwayTeam, Igame, IGame, IHomeTeam, ILeaderBoard, ILeaderBoardModel } from '../interfaces';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

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
  } as IGame;

  private getAwayTeamInfo(team: IAwayTeam): ILeaderBoard {
    const teaminfo = {
      name: team.teamName,
      totalGames: team.awayTeamId.length,
    };

    const gamesInfo = this.getAwayGamesInfo(team.awayTeamId);

    const data = { ...teaminfo, ...gamesInfo };

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

  private getHomeTeamInfo(team: IHomeTeam): ILeaderBoard {
    const teaminfo = {
      name: team.teamName,
      totalGames: team.homeTeamId.length,
    };

    const gamesInfo = this.getHomeGamesInfo(team.homeTeamId);

    const data = { ...teaminfo, ...gamesInfo };

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

  private getHomeGamesInfo(games: Igame[]): IGame {
    games.map((game: Igame) => {
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
      const eff = this.str.totalPoints / (games.length * 3);
      this.str.efficiency = `${(eff * 100).toFixed(2)}`; return '';
    });

    return this.str;
  }

  private getAwayGamesInfo(games: Igame[]): IGame {
    games.map((game: Igame) => {
      if (game.awayTeamGoals > game.homeTeamGoals) {
        this.str.totalPoints += 3;
        this.str.totalVictories += 1;
      }

      if (game.awayTeamGoals === game.homeTeamGoals) {
        this.str.totalPoints += 1;
        this.str.totalDraws += 1;
      }

      if (game.awayTeamGoals < game.homeTeamGoals) this.str.totalLosses += 1;

      this.str.goalsFavor += game.awayTeamGoals;
      this.str.goalsOwn += game.homeTeamGoals;
      this.str.goalsBalance = this.str.goalsFavor - this.str.goalsOwn;
      const eff = this.str.totalPoints / (games.length * 3);
      this.str.efficiency = `${(eff * 100).toFixed(2)}`; return '';
    });

    return this.str;
  }

  static sortGames(reduced: ILeaderBoard[]):ILeaderBoard[] {
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

  public async getClassifications(type: string): Promise<ILeaderBoard[]> {
    const homeTeams = await this.team.findAll({
      include: { model: this.match, as: 'homeTeamId', where: { inProgress: false } },
    }) as unknown as IHomeTeam[];

    const awayTeams = await this.team.findAll({
      include: { model: this.match, as: 'awayTeamId', where: { inProgress: false } },
    }) as unknown as IAwayTeam[];

    let reduced;

    if (type === 'home') reduced = homeTeams.map((team) => this.getHomeTeamInfo(team));
    if (type === 'away') reduced = awayTeams.map((team) => this.getAwayTeamInfo(team));

    const sorted = LeaderBoardModel.sortGames(reduced as ILeaderBoard[]);

    return sorted;
  }
}
