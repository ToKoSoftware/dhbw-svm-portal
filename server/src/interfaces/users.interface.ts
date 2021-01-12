import { EventRegistration } from '../models/event-registration.model';
import { Membership } from '../models/membership.model';
import { Organization } from '../models/organization.model';
import { PollAnswer } from '../models/poll-answer.model';
import { PollVote } from '../models/poll-vote.model';
import { RoleAssignment } from '../models/role-assignment.model';
import { Role } from '../models/role.model';
import { Team } from '../models/team.model';

export interface UserDataSnaphot {
    id?: string;
    email: string;
    username: string;
    password: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    gender: genderType;
    birthday: Date;
    street: string;
    street_number: string;
    post_code: string;
    city: string;
    is_active?: boolean;
}

export interface RawUserData extends UserDataSnaphot {
    org_id: string;
}

export interface UserData extends UserDataSnaphot {
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

export type genderType = 'M' | 'W' | 'D';