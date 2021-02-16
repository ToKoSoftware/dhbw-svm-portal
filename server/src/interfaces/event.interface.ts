import { EventRegistration } from '../models/event-registration.model';
import { Organization } from '../models/organization.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

export interface EventDataSnapshot{
    id?: string;
    title: string;
    description: string;
    price?: number | null;
    start_date: Date;
    end_date: Date;
    max_participants?: number | null;
    is_active?: boolean;
}

export interface RawEventData extends EventDataSnapshot{
    author_id?: string;
    org_id?: string;
    allowed_team_id?: string | null;
}

export interface EventData extends EventDataSnapshot{
    organization: Organization;
    author: User;
    allowed_team: Team;
    registered_users: Array<User & {event_registrations: EventRegistration}>
}