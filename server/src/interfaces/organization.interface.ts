import {Event} from '../models/event.model';
import {News} from '../models/news.model';
import {Poll} from '../models/poll.model';
import {Role} from '../models/role.model';
import {Team} from '../models/team.model';
import {User} from '../models/user.model';

export interface OrganizationDataSnapshot {
    id?: string;
    title: string;
    access_code: string;
    config: string;
    is_active?: boolean;
}

export interface RawOrganizationData extends OrganizationDataSnapshot {
    admin_role_id: string;
}

export interface OrganizationData extends OrganizationDataSnapshot {
    admin_role: Role;
    users: User[];
    events: Event[];
    news: News[];
    polls: Poll[];
    roles: Role[];
    teams: Team[];
}
