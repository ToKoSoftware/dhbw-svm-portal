import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import {TeamData} from '../interfaces/team.interface';
import Role from './role.model';
import Poll from './poll.model';
import User from './user.model';
import Organization from './organization.model';

const config = {
    tableName: 'Teams',
    sequelize: sequelizeInstance,
};

class Team extends Model {
    id?: string;
    title: string;
    is_active: boolean;

    public static requiredFields(): Array<keyof TeamData> {
        return [
            'title'
        ];
    }
}
Team.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4
        },
        title: {
            type: DataType.STRING,
            allowNull: false
        },
        is_active: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
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

Team.hasMany(Role, {
    foreignKey: 'maintain_role_id'
});
Team.hasMany(Poll, {
    foreignKey: 'answer_team_id'
});
Team.hasMany(User, {
    foreignKey: 'author_id'
});
Team.belongsTo(Organization);

export default Team;