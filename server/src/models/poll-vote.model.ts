import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import PollAnswer from './poll-answer.model';
import User from './user.model';

const config = {
    tableName: 'PollVotes',
    sequelize: sequelizeInstance,
};

class PollVote extends Model {
    id?: string;
    user_id: string;
    poll_answer_id: string;
    title: string | null;
}
PollVote.init(
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
        poll_answer_id: {
            type: DataType.UUID,
            references: {
              model: PollAnswer,
              key: 'id'
            }
        },
        title: {
            type: DataType.STRING,
            allowNull: true
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
User.belongsToMany(PollAnswer, {through: PollVote});
PollAnswer.belongsToMany(User, {through: PollVote});

export default PollVote;