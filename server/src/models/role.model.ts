import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import {RoleData} from '../interfaces/role.interface';
import Team from './team.model';
import Organization from './organization.model';

const config = {
    tableName: 'Roles',
    sequelize: sequelizeInstance,
};

class Role extends Model {
    id: string;
    title: string;
    user_deletable: boolean;
    is_active: boolean;

    public static requiredFields(): Array<keyof RoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }
}
Role.init(
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
        user_deletable: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
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

Role.belongsTo(Team);
Role.belongsTo(Organization);
Role.hasOne(Organization, {
    foreignKey: 'admin_role_id'
});

export default Role;