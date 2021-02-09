import { User } from '../models/user.model';
import { Vars } from '../vars';

export function userIsAdminCheck(user: User): boolean {
    Vars.loggy.log(user);
    if (user.org_id === null) {
        return false;
    }
    return user.assigned_roles.find(el => el.id === user.organization.admin_role_id) !== undefined;
}