import { RawRoleAssignmentData } from '../interfaces/role-assignment.interface';

export function mapRoleAssignment(incomingData: RawRoleAssignmentData, role_id: string): RawRoleAssignmentData {
    return {
        ...incomingData,
        role_id: role_id
    };
}