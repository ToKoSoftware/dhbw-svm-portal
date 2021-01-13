import {BelongsTo, Column, DefaultScope, ForeignKey, HasMany, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {RawOrganizationData} from '../interfaces/organization.interface';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { Team } from './team.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    attributes: { 
        exclude: ['access_code'] 
    },
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        attributes: { 
            exclude: ['access_code'] 
        },
        include: [{model: Role, as: 'admin_role'},{model: Role, as: 'roles'}, User, Team, News, Poll, Event]
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
export class Organization extends Model {

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