import {Model, Table, ForeignKey, Column, BelongsTo} from 'sequelize-typescript';
import { PollAnswer } from './poll-answer.model';
import { User } from './user.model';

@Table
export class PollVote extends Model {

    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => PollAnswer)
    @Column
    poll_answer_id: string;
    @Column
    title: string | null;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => PollAnswer)
    poll_answer: PollAnswer;

}