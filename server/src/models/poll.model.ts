import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import { PollData } from '../interfaces/poll.interface';
import Team from './team.model';
import User from './user.model';
import PollAnswer from './poll-answer.model';
import Organization from './organization.model';

const config = {
    tableName: 'Polls',
    sequelize: sequelizeInstance,
};

class Poll extends Model {
    id?: string;
    title: string;
    body: string;
    closes_at: Date;
    is_active: boolean;

    public static requiredFields(): Array<keyof PollData> {
        return [
            'title',
            'body',
            'closes_at'
        ];
    }
}
Poll.init(
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
        body: {
            type: DataType.STRING,
            allowNull: false
        },
        closes_at: {
            type: DataType.DATE,
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

Poll.belongsTo(Team);
Poll.belongsTo(User);
Poll.hasMany(PollAnswer, {
    foreignKey: 'poll_id'
});
Poll.belongsTo(Organization);

export default Poll;