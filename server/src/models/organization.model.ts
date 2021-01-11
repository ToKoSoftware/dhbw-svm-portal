import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import {OrganizationData} from '../interfaces/organization.interface';
import Team from './team.model';
import Event from './event.model';
import Role from './role.model';
import News from './news.model';
import User from './user.model';
import Poll from './poll.model';

const config = {
    tableName: 'Organizations',
    sequelize: sequelizeInstance,
};

export class Organization extends Model {

    id?: string;
    title: string;
    access_code: string;
    config: JSON;
    is_active: boolean;

    public static requiredFields(): Array<keyof OrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }
}
Organization.init(
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
        access_code: {
            type: DataType.STRING,
            allowNull: false
        },
        config: {
            type: DataType.JSON,
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

Organization.hasMany(Event, {
    foreignKey: 'org_id'
});
Organization.hasMany(Team, {
    foreignKey: 'org_id'
});
Organization.hasMany(Role, {
    foreignKey: 'org_id'
});
Organization.hasMany(News, {
    foreignKey: 'org_id'
});
Organization.hasMany(User, {
    foreignKey: 'org_id'
});
Organization.hasMany(Poll, {
    foreignKey: 'org_id'
});
Organization.belongsTo(Role);
export default Organization;