import {OrganizationDataSnapshot, RawOrganizationData} from '../interfaces/organization.interface';

export function mapOrg(incomingData: OrganizationDataSnapshot, adminRoleId: string): RawOrganizationData {
    return {
        ...incomingData,
        admin_role_id: adminRoleId,
        config: JSON.stringify({})
    };
}
