import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {News} from '../../../models/news.model';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';

export async function deleteNews(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //TODO check necessary?
    //check if currentUser is admin oder author of news
    const news_to_delete = await News.findOne({
        where: {
            id: req.params.id,
            is_active: true
        }
    })
        .catch(() => {
            success = false;
            return null;
        });


    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (news_to_delete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No active News with given id' }));
    }

    if(news_to_delete !== null) {
        if (news_to_delete.author_id !== null) {
            if (!currentUserIsAdminOrMatchesId(news_to_delete.author_id)) {
                if (!Vars.currentUser.is_admin) {
                    return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
                }
            }
        }
    }
 
    await News.update(
        {
            is_active: false,
        },
        {
            where: {
                id: req.params.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate News with id ' + req.params.id}));
    }

    return res.status(204).send(wrapResponse(true));
    
    
}