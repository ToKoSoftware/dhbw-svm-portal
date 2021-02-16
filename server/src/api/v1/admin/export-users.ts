import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {User} from '../../../models/user.model';
import {Vars} from '../../../vars';

export async function exportUsers(req: Request, res: Response): Promise<Response>  {
    let success = true;
    const users: User[] = await User.findAll(
        {
            where: {
                is_active: true,
                org_id: Vars.currentOrganization.id

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
    if (users.length === 0) {
        return res.status(404).send(wrapResponse(false, {error: 'No user found'}));
    }

    const csvData = convertObjectArrayToCsv(users);
    const date = new Date().toISOString();
    res.set({'Content-Disposition': `attachment; filename="${date}_Users.csv"`});

    return res.send(csvData);
}
