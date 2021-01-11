import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import User from './user.model';
import Team from './team.model';

const config = {
    tableName: 'Memberships',
    sequelize: sequelizeInstance,
};

class Membership extends Model {
    id: string;
    user_id: string;
    team_id: string;
}
Membership.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4
        },
        user_id: {
            type: DataType.UUID,
            references: {
                model: User,
                key: 'id'
            }
        },
        team_id: {
            type: DataType.UUID,
            references: {
                model: Team,
                key: 'id'
            }
        },
        createdAt: {
            allowNull: false,
            type: DataType.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataType.DATE
        }
    },
    config,
);
User.belongsToMany(Team, {through: Membership});
Team.belongsToMany(User, {through: Membership});

export default Membership;