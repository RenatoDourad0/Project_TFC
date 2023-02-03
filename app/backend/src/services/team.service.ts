import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team.model';

export default class TeamService {
  constructor(private model: ModelStatic<Team> = Team) {}

  async getAll() {
    const teams = await this.model.findAll();
    return teams;
  }
}
