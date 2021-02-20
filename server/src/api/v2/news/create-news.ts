import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapNews } from '../../../functions/map-news.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { NewsDataSnapshot, RawNewsData } from '../../../interfaces/news.interface';
import { CustomError } from '../../../middleware/error-handler';
import { News } from '../../../models/news.model';

export async function createNews(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: NewsDataSnapshot = req.body;
        const mappedIncomingData: RawNewsData = mapNews(incomingData);

        const requiredFields = News.requiredFields();
        if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
        }

        const createdData = await News.create(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });

        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not create News' }));
        }

        return res.send(wrapResponse(true, createdData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}