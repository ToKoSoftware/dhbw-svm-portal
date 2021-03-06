import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { News } from '../../../models/news.model';
import { Vars } from '../../../vars';
import { NewsData } from '../../../interfaces/news.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';


export async function getSingleNews(req: Request, res: Response): Promise<Response> {
    let success = true;

    const newsData: NewsData | null = await News
        .scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] })
        .findOne({
            where: {
                id: req.params.id
            },
            ...Vars.currentUserIsAdmin
                ? {
                    include: [Organization, User]
                }
                : {
                    include: {
                        model: User.scope('publicData')
                    }
                }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (newsData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, newsData));
}

export async function getAllNews(req: Request, res: Response): Promise<Response> {
    let success = true;
    const data = await News.scope(['full', { method: ['onlyCurrentOrg', Vars.currentOrganization.id] }]).findAll()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
