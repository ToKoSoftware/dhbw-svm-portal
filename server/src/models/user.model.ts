import {genderType, UserData} from '../interfaces/users.interface';
import {BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, HasMany, IsBefore, IsDate, IsEmail, IsIn, IsUUID, Length, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { EventRegistration } from './event-registration.model';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { PollAnswer } from './poll-answer.model';
import { PollVote } from './poll-vote.model';
import { Team } from './team.model';
import { Membership } from './membership.model';
import { Role } from './role.model';
import { RoleAssignment } from './role-assignment.model';

@DefaultScope(() => ({
    attributes: { 
        exclude: ['password'] 
    },
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        attributes: { 
            exclude: ['password'] 
        },
        include: [Organization, Event, PollAnswer, Team, Role]
    },
    fullAndActive: {
        attributes: { 
            exclude: ['password'] 
        },
        include: [Organization, Event, PollAnswer, Team, Role],
        where: {
            is_active: true
        }
    }
})) 

@Table
export class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @IsEmail
    @Column
    email: string;
    @Column
    username: string;
    @Column
    password: string;
    @Column
    is_admin: boolean;
    @Column
    first_name: string;
    @Column
    last_name: string;
    @IsIn([['M', 'W', 'D']])
    @Column
    gender: genderType;
    @IsDate
    @IsBefore(Date())
    @Column
    birthday: Date;
    @Column
    street: string;
    @Column
    street_number: string;
    @Length({min: 5, max: 5})
    @Column
    post_code: string;
    @Column
    city: string;
    @Column
    is_active: boolean;
    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsToMany(() => Event, () => EventRegistration)
    registered_events: Array<Event & {event_registrations: EventRegistration}>;
    @BelongsToMany(() => PollAnswer, () => PollVote)
    voted_poll_answers: Array<PollAnswer & {poll_vote: PollVote}>;
    @BelongsToMany(() => Team, () => Membership)
    teams: Array<Team & {membership: Membership}>;
    @BelongsToMany(() => Role, () => RoleAssignment)
    assigned_roles: Array<Role & {role_assignment: RoleAssignment}>;

    @HasMany(() => Event)
    created_events: Event[];
    @HasMany(() => News)
    created_news: News[];
    @HasMany(() => Poll)
    created_polls: Poll[];


    public static requiredFields(): Array<keyof UserData> {
        return [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'street',
            'street_number',
            'post_code',
            'city'
        ];
    }
}