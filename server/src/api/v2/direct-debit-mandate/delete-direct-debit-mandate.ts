import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { DirectDebitMandate } from "../../../models/direct-debit-mandate.model";
import { User } from "../../../models/user.model";
import { Vars } from "../../../vars";

export async function deleteDirectDebitMandate(req: Request, res: Response): Promise<Response> {
    let success = true;
    const orgId = Vars.currentOrganization.id;
    const userId = Vars.currentUser.id;

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

    const directDebitMandateData: DirectDebitMandate | null = await DirectDebitMandate.findOne(
        {
            where: {
                user_id: userId,
                org_id: orgId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (directDebitMandateData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No DirectDebitMandate found!' }));
    }
    await directDebitMandateData.destroy();

    return res.status(204).send();
}