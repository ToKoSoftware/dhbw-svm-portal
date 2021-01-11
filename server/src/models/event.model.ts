import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import {EventData} from '../interfaces/event.interface';
import User from './user.model';
import Organization from './organization.model';

const config = {
    tableName: 'Events',
    sequelize: sequelizeInstance,
};

class Event extends Model {
    id: string;
    title: string;
    description: string;
    price: number | null;
    date: Date;
    max_participants: number | null;
    is_active: boolean;

    public static requiredFields(): Array<keyof EventData> {
        return [
            'title',
            'description',
            'price',
            'date',
            'max_participants'
        ];
    }
}
Event.init(
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
        description: {
            allowNull: false,
            type: DataType.STRING,
        },
        price: {
            allowNull: true,
            type: DataType.INTEGER,
        },
        date: {
            allowNull: false,
            type: DataType.DATE
        },
        max_participants: {
            allowNull: true,
            type: DataType.INTEGER
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

Event.belongsTo(User);
Event.belongsTo(Organization);

export default Event;