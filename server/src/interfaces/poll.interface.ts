export interface PollData{
    id?: string;
    title: string;
    body: string;
    closes_at: Date;
    author_id: string;
    org_id: string;
    answer_team_id: string;
    is_active?: boolean;
}