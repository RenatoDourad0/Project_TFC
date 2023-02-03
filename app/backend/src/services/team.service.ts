import Team from '../database/models/Team.model';

export default class TeamService {
  constructor(private teamModel = Team) {}

  async getAll() {
    const teams = await this.teamModel.findAll();
    return teams;
  }
}
