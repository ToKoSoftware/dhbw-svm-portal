import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

export interface EventLogDataSnapshot{
    id?: string;
    called_function: string | null;
    input_data: string | null;
    success: boolean;
}

export interface RawEventLogData extends EventLogDataSnapshot{
    user_id: string;
    org_id: string;
}

export interface EventLogData extends EventLogDataSnapshot{
    user: User;
    organization: Organization;
}