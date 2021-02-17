import {
    Table, Column, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey, NotEmpty,
    DefaultScope, Scopes, BeforeCreate
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawPollAnswerData } from '../interfaces/poll-answer.interface';
import { LoggedModel } from './logged.model';
import { PollVote } from './poll-vote.model';
import { Poll } from './poll.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: User.scope('publicData')
    },
    includePoll: {
        include: Poll
    },
    active: {
        required: false,
        where: {
            is_active: true
        }
    },
    inactive: {
        required: false,
        where: {
            is_active: false
        }
    }
}))

@Table
export class PollAnswer extends LoggedModel {

    public static modelName = 'PollAnswer';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
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
    voted_users: Array<User & { poll_vote: PollVote }>;

    @BeforeCreate
    static addUuid(instance: PollAnswer): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawPollAnswerData> {
        return [
            'title',
            'poll_id',
            'is_active',
        ];
    }
}