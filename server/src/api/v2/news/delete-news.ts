import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { News } from '../../../models/news.model';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { Vars } from '../../../vars';

export async function deleteNews(req: Request, res: Response): Promise<Response> {
    let success = true;

    const newsToDelete = await News.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });


    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (newsToDelete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No active News with given id' }));
    } else if (newsToDelete.author_id !== null &&!currentUserIsAdminOrMatchesId(newsToDelete.author_id) && !Vars.currentUserIsAdmin ) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }

    await newsToDelete.destroy()
        .catch(() => {
            success = false;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete News with id ' + req.params.id }));
    }

    return res.status(204).send(wrapResponse(true));


}