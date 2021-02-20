import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventRegistration } from '../../../models/event-registration.model';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { Vars } from '../../../vars';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';

export async function deleteEventRegistration(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const eventRegistrationToDelete = await EventRegistration.findByPk(req.params.id);
        if (!eventRegistrationToDelete) next(new CustomError(PortalErrors.NOT_FOUND, 404));
        else if (eventRegistrationToDelete.user_id &&
            !currentUserIsAdminOrMatchesId(eventRegistrationToDelete.user_id) &&
            !Vars.currentUserIsAdmin) return next(new CustomError(PortalErrors.FORBIDDEN, 403));

        //Hard delete
        await eventRegistrationToDelete?.destroy().catch(() => {
            return next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500));
        });
        return res.status(204).send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
