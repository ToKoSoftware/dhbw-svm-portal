import { EventRegistration } from '../models/event-registration.model';
import { Membership } from '../models/membership.model';
import { Organization } from '../models/organization.model';
import { PollAnswer } from '../models/poll-answer.model';
import { PollVote } from '../models/poll-vote.model';
import { RoleAssignment } from '../models/role-assignment.model';
import { Role } from '../models/role.model';
import { Team } from '../models/team.model';

export interface UserDataSnapshot {
    id?: string;
    email: string;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    gender: genderType;
    birthday: Date;
    street: string;
    street_number: string;
    post_code: string;
    city: string;
    is_active?: boolean;
    last_login?: Date;
}

export interface RawUserData extends UserDataSnapshot {
    org_id: string | null;
}

export interface UserData extends UserDataSnapshot {
    organization: Organization;
    registered_events: Array<Event & {event_registrations: EventRegistration}>;
    voted_poll_answers: Array<PollAnswer & {poll_vote: PollVote}>;
    teams: Array<Team & {membership: Membership}>;
    assigned_roles: Array<Role & {role_assignment: RoleAssignment}>;
}

export interface UserLoginData {
    email?: string;
    username?: string;
    password: string;
}

export interface UserRegistrationData extends UserDataSnapshot {
    access_code?: string;
    accepted_privacy_policy?: boolean;
}

export type genderType = 'M' | 'W' | 'D';
