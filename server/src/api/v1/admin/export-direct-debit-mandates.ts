import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {DirectDebitMandate} from '../../../models/direct-debit-mandate.model';
import {Vars} from '../../../vars';

export async function exportDirectDebitMandates(req: Request, res: Response): Promise<Response>  {
    let success = true;
    const directDebitMandate: DirectDebitMandate[] = await DirectDebitMandate
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]}) 
        .findAll(
            { 
                raw: true
            })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    
    if (directDebitMandate.length === 0) {
        return res.status(404).send(wrapResponse(false, {error: 'No DirectDebitMandate found'}));
    }
    
    const csvData = convertObjectArrayToCsv(directDebitMandate);
    const date = new Date().toISOString();
    res.set({'Content-Disposition': `attachment; filename="${date}_direct-debit-mandate.csv"`});

    return res.send(csvData);
}
