import { RawTeamData } from '../interfaces/team.interface';
import { Vars } from '../vars';

export function mapTeam(incomingData: RawTeamData): RawTeamData {
    return {
        ...incomingData,
        maintain_role_id: incomingData.maintain_role_id === undefined ?  Vars.currentOrganization.admin_role_id : incomingData.maintain_role_id, //TODO im req.body evtl. angeben können
        org_id: Vars.currentOrganization.id
    };
} 