import {BelongsTo, Column, ForeignKey, IsUUID, Model, PrimaryKey, Table} from 'sequelize-typescript';
import { Team } from './team.model';
import { User } from './user.model';

@Table
export class Membership extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @IsUUID(4)    
    @ForeignKey(() => Team)
    @Column
    team_id: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Team)
    team: Team;

}
