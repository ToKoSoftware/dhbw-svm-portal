import {OrganizationDataSnapshot, RawOrganizationData} from '../interfaces/organization.interface';

export function mapOrg(incomingData: OrganizationDataSnapshot, adminRoleId: string, publicTeamId: string): RawOrganizationData {
    return {
        ...incomingData,
        admin_role_id: adminRoleId,
        public_team_id: publicTeamId,
        config: JSON.stringify({})
    };
}
