import { RoleDataSnapshot, RawRoleData } from '../interfaces/role.interface';
import { Vars } from '../vars';

export function mapRole(incomingData: RoleDataSnapshot): RawRoleData {
    return {
        ...incomingData,
        org_id: Vars.currentOrganization.id
    };
} 