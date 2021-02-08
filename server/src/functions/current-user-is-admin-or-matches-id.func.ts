import {Vars} from '../vars';

export function currentUserIsAdminOrMatchesId(allowedUserId: string): boolean {
    if (Vars.currentUserIsAdmin) {
        return true;
    } else if (Vars.currentUser.id === allowedUserId) {
        return true;
    }

    return false;
}
