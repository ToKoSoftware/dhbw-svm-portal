import {Model, Table, Column, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey, IsUUID, NotEmpty, DefaultScope, Scopes} from 'sequelize-typescript';
import { PollAnswerData } from '../interfaces/poll-answer.interface';
import { PollVote } from './poll-vote.model';
import { Poll } from './poll.model';
import { User } from './user.model';

@DefaultScope(() => ({
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [Poll, User]
    },
    fullAndActive: {
        include: [Poll, User],
        where: {
            is_active: true
        }
    }
})) 

@Table
export class PollAnswer extends Model {
    
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    is_active: boolean;
    @IsUUID(4)
    @ForeignKey(() => Poll)
    @Column
    poll_id: string;

    @BelongsTo(() => Poll)
    poll: Poll;
    @BelongsToMany(() => User, () => PollVote)
    voted_users: Array<User & {poll_vote: PollVote}>;


    public static requiredFields(): Array<keyof PollAnswerData> {
        return [
            'title',
        ];
    }
}