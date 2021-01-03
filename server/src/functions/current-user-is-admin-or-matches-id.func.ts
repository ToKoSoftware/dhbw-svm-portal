import {Vars} from '../vars';

export function currentUserIsAdminOrMatchesId(allowedUserId: string): boolean {
    if (Vars.currentUser.is_admin) {
        return true;
    } else if (Vars.currentUser.id === allowedUserId) {
        return true;
    }

    return false;
}
