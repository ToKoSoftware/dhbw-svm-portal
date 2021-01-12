import {BelongsTo, Column, ForeignKey, IsUUID, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
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
