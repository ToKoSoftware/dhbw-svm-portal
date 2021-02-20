import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { User } from '../../../models/user.model';

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const destroyedRows = await User.destroy(
            {
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
        if (destroyedRows == 0) {
            return res.status(404).send(wrapResponse(false, { error: 'There is no user to delete with this id' }));
        }
        return res.status(204).send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
