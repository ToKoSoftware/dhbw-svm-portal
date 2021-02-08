import { User } from "../models/user.model";

export function userIsAdminCheck(user: User): boolean {
    return user.assigned_roles.find(el => el.id === user.organization.admin_role_id) !== undefined;
}