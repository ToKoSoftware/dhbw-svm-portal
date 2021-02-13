import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapDirectDebitMandate } from '../../../functions/map-direct-debit-mandate.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { DirectDebitMandateDataSnapshot, RawDirectDebitMandateData } from '../../../interfaces/direct-debit-mandate.interface';
import { DirectDebitMandate } from '../../../models/direct-debit-mandate.model';

export async function createDirectDebitMandate(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: DirectDebitMandateDataSnapshot = req.body;
    const mappedIncomingData: RawDirectDebitMandateData = mapDirectDebitMandate(incomingData);

    const requiredFields = DirectDebitMandate.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const directDebitMandate: [DirectDebitMandate, boolean] | null = await DirectDebitMandate.findOrCreate(
        {
            where: {
                ...mappedIncomingData
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success || directDebitMandate === null) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create DirectDebitMandate' }));
    }

    const returnValue = directDebitMandate[1] ? directDebitMandate[0] : { info: 'Data already existed.'};
    return res.send(wrapResponse(true, returnValue));
}