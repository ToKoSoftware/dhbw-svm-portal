import { RoleDataSnapshot, RawRoleData } from '../interfaces/role.interface';
import { Vars } from '../vars';

export function mapRole(incomingData: RoleDataSnapshot): RawRoleData {
    return {
        ...incomingData,
        user_deletable: true,
        org_id: Vars.currentOrganization.id
    };
} 