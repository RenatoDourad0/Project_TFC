import Team from '../../database/models/Team.model';

export default interface ITeamService {
  getAll(): Promise<Team[]>;
  getById(id: number): Promise<Team | null>;
}
