import { Team } from '../models/team.model';
import { Vars } from '../vars';

export async function getMaintainedTeamIdsOfCurrentUser(): Promise<string[]> {
    const maintainedRoleIds = Vars.currentUser.assigned_roles.map(r => r.id);
    const maintainedTeams = await Team.findAll(
        {
            where: {
                maintain_role_id: maintainedRoleIds
            }
        });
    return maintainedTeams.map(t => t.id);
}