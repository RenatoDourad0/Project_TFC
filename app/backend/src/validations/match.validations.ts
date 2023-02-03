import { NotFoundError, UnauthorizedError, UnprocessableError } from '../errors';
import Match from '../database/models/Match.model';
import JwtAuth from '../auth/JwtAuth';
import Team from '../database/models/Team.model';

export default class MatchValidator {
  public static uniqueAdversaries(match: Match) {
    if (match.awayTeamId === match.homeTeamId) {
      throw new UnprocessableError('It is not possible to create a match with two equal teams');
    }
  }

  public static async teamsExists(match: Match) {
    const teamsIds = [match.homeTeamId, match.awayTeamId];
    const teams = await Promise.all(teamsIds.map((async (id) => Team.findByPk(Number(id)))));

    if (teams[0] === null || teams[1] === null) {
      throw new NotFoundError('There is no team with such id!');
    }
  }

  public static async validateCredentials(token: string) {
    const auth = new JwtAuth();
    try {
      await auth.validate(token);
    } catch (error) {
      throw new UnauthorizedError('Token must be a valid token');
    }
  }

  public static async matchExists(id: number) {
    const match = await Match.findByPk(Number(id));
    if (match === null) {
      throw new NotFoundError('There is no match with such id!');
    }
  }
}
