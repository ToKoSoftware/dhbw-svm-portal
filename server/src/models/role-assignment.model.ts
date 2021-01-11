import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import User from './user.model';
import Role from './role.model';

const config = {
    tableName: 'RoleAssignments',
    sequelize: sequelizeInstance,
};

class RoleAssignment extends Model {
    id: string;
    user_id: string;
    role_id: string;
}
RoleAssignment.init(
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
        role_id: {
            type: DataType.UUID,
            references: {
                model: Role,
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
User.belongsToMany(Role, {through: RoleAssignment});
Role.belongsToMany(User, {through: RoleAssignment});

export default RoleAssignment;