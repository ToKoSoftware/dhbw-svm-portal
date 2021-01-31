import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Scopes, Table, BeforeCreate} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import { RawMembershipData } from '../interfaces/membership.interface';
import { Team } from './team.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Team]
    }
}))

@Table
export class Membership extends Model {

    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Team)
    @Column
    team_id: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Team)
    team: Team;

    @BeforeCreate
    static addUuid(instance: Membership): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawMembershipData> {
        return [
            'user_id',
            'team_id'
        ];
    }
}
