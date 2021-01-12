import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import { Team } from './team.model';
import { User } from './user.model';

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
