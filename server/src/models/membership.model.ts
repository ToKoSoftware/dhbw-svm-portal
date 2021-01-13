import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
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

}
