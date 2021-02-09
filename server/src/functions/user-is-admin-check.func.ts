import { User } from '../models/user.model';

export function userIsAdminCheck(user: User): boolean {
    if (user.org_id === null) {
        return false;
    }
    return user.assigned_roles.find(el => el.id === user.organization.admin_role_id) !== undefined;
}
