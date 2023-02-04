import { ModelStatic } from 'sequelize';
import MatchValidator from '../validations/match.validations';
import Team from '../database/models/Team.model';
import { IMatchService } from '../interfaces';
import Match from '../database/models/Match.model';

export default class MatchService implements IMatchService {
  constructor(private model:ModelStatic<Match> = Match) {}

  async getAll(): Promise<Match[]> {
    const matches = await this.model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return matches;
  }

  async getAllByProgress(inProgress: boolean): Promise<Match[]> {
    if (inProgress) {
      const matches = await this.model.findAll({
        where: { inProgress: true },
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ],
      });
      return matches;
    }
    const matches = await this.model.findAll({
      where: { inProgress: false },
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return matches;
  }

  async create(
    match: Exclude<Match, { id: number, inProgress: boolean }>,
    token: string,
  ): Promise<Match> {
    await MatchValidator.validateCredentials(token);
    MatchValidator.uniqueAdversaries(match);
    await MatchValidator.teamsExists(match);
    const newMatch = await this.model.create({ ...match as object, inProgress: true });
    return newMatch;
  }

  async updateProgressStatus(id: number): Promise<boolean> {
    const [affectedRows] = await this.model.update({ inProgress: false }, { where: { id } });
    return affectedRows === 1;
  }

  async update(
    id: number,
    newData: { homeTeamGoals: number, awayTeamGoals: number },
  ): Promise<boolean> {
    await MatchValidator.matchExists(id);
    const [affectedRows] = await this.model.update(
      { homeTeamGoals: newData.homeTeamGoals,
        awayTeamGoals: newData.awayTeamGoals },
      { where: { id } },
    );
    return affectedRows === 1 || affectedRows === 2;
  }
}
