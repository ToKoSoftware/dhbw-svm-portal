export function currentOrg (org_id: string): Record<string, unknown>{
    return {
        required: false,
        where: {
            org_id: org_id
        }
    };
}