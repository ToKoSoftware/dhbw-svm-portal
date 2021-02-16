import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {EventData} from '../../../interfaces/event.interface';
import {EventRegistration} from '../../../models/event-registration.model';
import {Vars} from '../../../vars';
import {Event} from '../../../models/event.model';

export async function exportEventRegistrations(req: Request, res: Response): Promise<Response>  {
    let success = true;

    const eventData: EventData | null = await Event
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findOne({
            where: {
                id: req.params.id   
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (eventData === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No event with given id found'}));
    }
   
    const eventRegistration: EventRegistration[] = await EventRegistration.findAll(
        {
            where: {
                event_id: req.params.id
            }, 
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    if (eventRegistration.length === 0) {
        return res.status(404).send(wrapResponse(false, {error: 'No event-registration found'}));
    }

    const csvData = convertObjectArrayToCsv(eventRegistration);
    const date = new Date().toISOString();
    res.set({'Content-Disposition': `attachment; filename="${date}_${eventData.title}_registrations.csv"`});

    return res.send(csvData);
}
