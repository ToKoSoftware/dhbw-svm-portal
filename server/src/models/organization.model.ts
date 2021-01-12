import {BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {RawOrganizationData} from '../interfaces/organization.interface';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { Team } from './team.model';
import { User } from './user.model';

@Table
export class Organization extends Model {

    @PrimaryKey
    @Column
    id: string;
    @Column
    title: string;
    @Column
    access_code: string;
    @Column
    config: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Role)
    @Column
    admin_role_id: string;

    @BelongsTo(() => Role, 'admin_role_id')
    admin_role: Role;

    @HasMany(() => User)
    users: User[];
    @HasMany(() => Event)
    events: Event[];
    @HasMany(() => News)
    news: News[];
    @HasMany(() => Poll)
    polls: Poll[];
    @HasMany(() => Role, 'org_id')
    roles: Role[];
    @HasMany(() => Team)
    teams: Team[];

    public static requiredFields(): Array<keyof RawOrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }
}