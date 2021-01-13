import {Model, Table, ForeignKey, Column, BelongsTo, AllowNull, PrimaryKey, Scopes} from 'sequelize-typescript';
import { PollAnswer } from './poll-answer.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, PollAnswer]
    }
})) 

@Table
export class PollVote extends Model {

    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => PollAnswer)
    @Column
    poll_answer_id: string;
    @AllowNull
    @Column
    title: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => PollAnswer)
    poll_answer: PollAnswer;

}