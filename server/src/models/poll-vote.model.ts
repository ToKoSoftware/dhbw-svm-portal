import { Table, ForeignKey, Column, BelongsTo, AllowNull, PrimaryKey, Scopes, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { LoggedModel } from './logged.model';
import { PollAnswer } from './poll-answer.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, PollAnswer]
    }
}))

@Table
export class PollVote extends LoggedModel {

    public static modelName = 'PollVote';
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

    @BeforeCreate
    static addUuid(instance: PollVote): string {
        return instance.id = uuidv4();
    }

}