import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { DirectDebitMandate } from '../../../models/direct-debit-mandate.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getDirectDebitMandate(req: Request, res: Response): Promise<Response> {
    let success = true;
    const orgId = Vars.currentOrganization.id;
    const userId = Vars.currentUserIsAdmin ? req.params.id : Vars.currentUser.id;
    const showDeleted = req.query.showDeleted === 'true';

    const user: User | null = await User.scope({ method: ['onlyCurrentOrg', orgId] }).findByPk(userId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if(user === null) {
        return res.status(403).send(wrapResponse(false, { error: 'Forbidden'}));
    }

    const directDebitMandateData: DirectDebitMandate[] = await DirectDebitMandate.findAll(
        {
            where: {
                user_id: userId,
                org_id: orgId
            },
            paranoid: !showDeleted
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success || directDebitMandateData === []) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, directDebitMandateData));
}

export async function getDirectDebitMandates(req: Request, res: Response): Promise<Response> {
    let success = true;
    const orgId = Vars.currentOrganization.id;

    const directDebitMandateData: DirectDebitMandate[] = await DirectDebitMandate.findAll(
        {
            where: {
                org_id: orgId
            },
            include: User,
            paranoid: false
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success || directDebitMandateData === []) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, directDebitMandateData));
}