import {BeforeCreate, BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, HasMany, IsBefore, IsDate, IsEmail, IsIn, Length, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {genderType, RawUserData} from '../interfaces/users.interface';
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
    required: false,
    attributes: { 
        exclude: ['password'] 
    },
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        required: false,
        attributes: { 
            exclude: ['password'] 
        },
        include: [Organization, {model: Event, as: 'registered_events'}, {model: Event, as: 'created_events'}, PollAnswer, Team, Role, News, Poll]
    },
    verification: {
        required: false,
        include: [Organization, {model: Event, as: 'registered_events'}, {model: Event, as: 'created_events'}, PollAnswer, Team, Role, News, Poll]
    },
    active: {
        required: false,
        attributes: { 
            exclude: ['password'] 
        },
        where: {
            is_active: true
        }
    },
    inactive: {
        required: false,
        attributes: { 
            exclude: ['password'] 
        },
        where: {
            is_active: false
        }
    },
    onlyCurrentOrg: (org_id: string) => ({
        required: false,
        attributes: { 
            exclude: ['password'] 
        },
        where: {
            org_id: org_id
        }
    }),
    publicData: {
        required: false,
        attributes: ['id', 'username', 'first_name', 'last_name'] ,
        where: {
            is_active: true
        }
    }
})) 

@Table
export class User extends Model {

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
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BeforeCreate
    static addUuid(instance: User): string {
        return instance.id = uuidv4();
    }

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


    public static requiredFields(): Array<keyof RawUserData> {
        return [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'birthday',
            'street',
            'street_number',
            'post_code',
            'city',
            'org_id'
        ];
    }
}
