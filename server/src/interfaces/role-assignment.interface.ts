import { Role } from '../models/role.model';
import { User } from '../models/user.model';

export interface RoleAssignmentDataSnapshot{
    id?: string
}

export interface RawRoleAssignmentData extends RoleAssignmentDataSnapshot{
    user_id: string;
    role_id: string;
}

export interface RoleAssignmentData extends RoleAssignmentDataSnapshot{
    user: User;
    role: Role;
}