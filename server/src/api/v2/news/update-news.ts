import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawNewsData } from '../../../interfaces/news.interface';
import { News } from '../../../models/news.model';

export async function updateNews(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawNewsData = req.body;
    const newsId = req.params.id;

    const newsData: News | null = await News.findByPk(newsId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (newsData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No News with given id found' }));
    }

    // Author_id and org_id must not be changed
    if (incomingData.author_id !== newsData.author_id || incomingData.org_id !== newsData.org_id) {
        if (incomingData.author_id !== undefined || incomingData.org_id !== undefined) {
            return res.status(400).send(wrapResponse(false, { error: 'Author_id and org_id must not be changed!' }));
        }
    }

    const requiredFields = News.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    newsData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (newsData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, newsData));
}