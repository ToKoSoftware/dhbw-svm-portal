import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { convertObjectArrayToCsv } from '../../../functions/convert-object-array-to-csv.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { DirectDebitMandate } from '../../../models/direct-debit-mandate.model';
import { Vars } from '../../../vars';

export async function exportDirectDebitMandates(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const directDebitMandate: DirectDebitMandate[] = await DirectDebitMandate
            .scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] })
            .findAll(
                {
                    raw: true
                })
            .catch(() => {
                success = false;
                return [];
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }

        if (directDebitMandate.length === 0) {
            return res.status(404).send(wrapResponse(false, { error: 'No DirectDebitMandate found' }));
        }

        const csvData = convertObjectArrayToCsv(directDebitMandate);
        const date = new Date().toISOString();
        res.set({ 'Content-Disposition': `attachment; filename="${date}_direct-debit-mandate.csv"` });

        return res.send(csvData);
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
