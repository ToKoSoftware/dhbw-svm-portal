import {Model, Table, Column, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey} from 'sequelize-typescript';
import { RawPollAnswerData } from '../interfaces/poll-answer.interface';
import { PollVote } from './poll-vote.model';
import { Poll } from './poll.model';
import { User } from './user.model';

@Table
export class PollAnswer extends Model {
    
    @PrimaryKey
    @Column
    id: string;
    @Column
    title: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Poll)
    @Column
    poll_id: string;

    @BelongsTo(() => Poll)
    poll: Poll;
    @BelongsToMany(() => User, () => PollVote)
    voted_users: Array<User & {poll_vote: PollVote}>;


    public static requiredFields(): Array<keyof RawPollAnswerData> {
        return [
            'title',
        ];
    }
}