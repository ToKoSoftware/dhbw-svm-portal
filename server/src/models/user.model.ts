import {genderType, UserData} from '../interfaces/users.interface';
import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';
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

@Table
export class User extends Model {

    @PrimaryKey
    @Column
    id: string;
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
    @Column
    gender: genderType;
    @Column
    birthday: Date;
    @Column
    street: string;
    @Column
    street_number: string;
    @Column
    post_code: string;
    @Column
    city: string;
    @Column
    is_active: boolean;
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