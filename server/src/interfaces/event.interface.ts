export interface EventData{
    id?: string;
    title: string;
    description: string;
    price: number | null;
    date: Date;
    max_participants: number | null;
    author_id: string;
    org_id: string;
    is_active?: boolean;
}