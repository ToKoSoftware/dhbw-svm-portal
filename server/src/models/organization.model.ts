import {BelongsTo, Column, DefaultScope, ForeignKey, HasMany, IsUUID, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {OrganizationData} from '../interfaces/organization.interface';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { Team } from './team.model';
import { User } from './user.model';

@DefaultScope(() => ({
    attributes: { 
        exclude: ['aceess_code'] 
    },
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        attributes: { 
            exclude: ['aceess_code'] 
        },
        include: [{model: Role, as: 'admin_role'},{model: Role, as: 'roles'}, User, Team, News, Poll, Event]
    },
    fullAndActive: {
        attributes: { 
            exclude: ['aceess_code'] 
        },
        include: [{model: Role, as: 'admin_role'},{model: Role, as: 'roles'}, User, Team, News, Poll, Event],
        where: {
            is_active: true
        }
    }
}))

@Table
export class Organization extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @NotEmpty
    @Column
    access_code: string;
    @Column
    config: string;
    @Column
    is_active: boolean;
    @IsUUID(4)
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

    public static requiredFields(): Array<keyof OrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }
}