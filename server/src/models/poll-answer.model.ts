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
    include: User.scope('publicData')
}))
@Scopes(() => ({
    full: {
        required: false,
        include: User.scope('publicData')
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
        ];
    }
}