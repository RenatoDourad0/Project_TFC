import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import Team from './Team.model';

class Match extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamsGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  homeTeamId: {
    field: 'home_team_id',
    allowNull: false,
    type: INTEGER,
  },
  homeTeamGoals: {
    field: 'home_team_goals',
    allowNull: false,
    type: INTEGER,
    references: {
      model: 'Team',
      key: 'id',
    },
  },
  awayTeamId: {
    field: 'away_team_id',
    allowNull: false,
    type: INTEGER,
  },
  awayTeamsGoals: {
    field: 'away_team_goals',
    allowNull: false,
    type: INTEGER,
    references: {
      model: 'Team',
      key: 'id',
    },
  },
  inProgress: {
    field: 'in_progress',
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Match',
  timestamps: false,
});

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'id' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'id' });

Team.hasMany(Match, { foreignKey: 'id', as: 'homeTeamId' });
Team.hasMany(Match, { foreignKey: 'id', as: 'awayTeamId' });

export default Match;
