import { Request, Response } from 'express';
import { FindOptions} from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';
import { PollData } from '../../../interfaces/poll.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Team } from '../../../models/team.model';


export async function getPoll(req: Request, res: Response): Promise<Response> {
    let success = true;


    const pollData: PollData | null = await Poll
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findOne({
            where: {
                    id: req.params.id   
            },
            ... Vars.currentUser.is_admin ? {
                include: [Organization, User, Team, PollAnswer]
            } : {
                include: {
                    model: User.scope('publicData')
                }
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, pollData));
}

export async function getPolls(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {};
    const allowedSearchFilterAndOrderFields = ['title'];
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    };
    query = buildQuery(queryConfig, req);

    let success = true;
    const data = await Poll.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
