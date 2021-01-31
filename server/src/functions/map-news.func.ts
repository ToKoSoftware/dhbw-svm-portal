import { NewsDataSnapshot, RawNewsData } from '../interfaces/news.interface';
import { Vars } from '../vars';

export function mapNews(incomingData: NewsDataSnapshot): RawNewsData {
    return {
        ...incomingData,
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
}