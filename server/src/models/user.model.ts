import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {genderType, UserData} from '../interfaces/users.interface';
import {Model, DataType} from 'sequelize-typescript';
import Event from './event.model';
import News from './news.model';
import Organization from './organization.model';

const config = {
    tableName: 'Users',
    sequelize: sequelizeInstance,
};

class User extends Model {
    id: string
    email: string;
    username: string;
    password: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    gender: genderType;
    street: string;
    street_number: string;
    post_code: string;
    city: string;
    is_active: boolean;

    public static requiredFields(): Array<keyof UserData> {
        return [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'street',
            'street_number',
            'post_code',
            'city'
        ];
    }
}
User.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4
        },
        email: {
            type: DataType.STRING,
            allowNull: false
        },
        username: {
            type: DataType.STRING,
            allowNull: false
        },
        password: {
            type: DataType.STRING,
            allowNull: false
        },
        is_admin: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        first_name: {
            type: DataType.STRING,
            allowNull: false
        },
        last_name: {
            type: DataType.STRING,
            allowNull: false
        },
        gender: {
            type: DataType.CHAR,
            allowNull: false
        },
        street: {
            type: DataType.STRING,
            allowNull: false
        },
        street_number: {
            type: DataType.STRING,
            allowNull: false
        },
        post_code: {
            type: DataType.STRING,
            allowNull: false
        },
        city: {
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

User.hasMany(Event, {
    foreignKey: 'author_id'
});
User.hasMany(News, {
    foreignKey: 'author_id'
});
User.belongsTo(Organization);

export default User;