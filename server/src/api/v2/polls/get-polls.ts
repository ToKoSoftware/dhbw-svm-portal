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
            ... Vars.currentUserIsAdmin? {
                include: [Organization, User, Team, PollAnswer]
            } : { 
                where: {
                    answer_team_id : Vars.currentUser.teams.map(t => t.id)
                },
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
        return res.status(404).send(wrapResponse(false)); //TODO Rechte-Checken #87
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
    const currentDate = new Date();
    const data = await Poll.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 'active', {method: ['notExpired', currentDate]}, 'ordered']).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
