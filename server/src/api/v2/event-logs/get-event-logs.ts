import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventLog } from '../../../models/event-log.model';
import { Vars } from '../../../vars';

export async function getEventLogs(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: {user_id: string} = req.body;

    let query;
    if (incomingData?.user_id === undefined) {
        query = {
            where: {
                org_id: Vars.currentOrganization.id
            }
        };
    } else {
        query = {
            where: {
                org_id: Vars.currentOrganization.id,
                user_id: incomingData.user_id
            }
        };
    }
    
    const logData: EventLog[] = await EventLog.findAll(query)
        .catch((error) => {
            Vars.loggy.log(error);
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, logData));
}