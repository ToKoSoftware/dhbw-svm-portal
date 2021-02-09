import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {Vars} from '../../vars';
import {SingleSignOnRequest} from '../../models/single-sign-on-request.model';
import {loadOrgSetting} from '../../functions/settings.func';

export async function oauth2Authentication(req: Request, res: Response): Promise<void> {
    // destroy all open sign-in requests for current user
    await SingleSignOnRequest.destroy({
        where: {
            user_id: Vars.currentUser.id
        }
    });
    // create new request that's going be saved in database
    const ssoRequest: SingleSignOnRequest | null = await SingleSignOnRequest.create({
        user_id: Vars.currentUser.id
    }).then(ssoRequest => ssoRequest).catch(() => null);
    if (ssoRequest) {
        const url = `${req.query.redirect_uri}callback?state=${req.query.state}&code=${ssoRequest.id}`;
        return res.redirect(url);
    } else {
        res.status(403).send({
            error: 'Could not perform single-sign-on.'
        });
    }
}

export async function oauth2Token(req: Request, res: Response): Promise<Response> {
    // make it impossible to get a random id
    const id = req.body.code || 'null';
    // check if a request exists with id
    const ssoRequest: SingleSignOnRequest | null = await SingleSignOnRequest.findByPk(id).then(ssoRequest => ssoRequest).catch(() => null);
    if (!ssoRequest) {
        return res.status(403).send({
            error: 'Could not perform single-sign-on.'
        });
    }
    // load new current organization
    Vars.currentOrganization = ssoRequest.user.organization;
    // get and clean-up basic auth token
    const encodedSecret = (req.headers['authorization'] || '').replace('Basic ', '');
    // decode token
    const clientSecret = Buffer.from(encodedSecret, 'base64').toString('utf-8');
    const oauth2config = await loadOrgSetting<OAuth2ClientConfiguration>('oauth2');
    if (!oauth2config) {
        return res.status(500).send({
            error: 'No OAuth2 config found.'
        });
    }
    // secret is provided as application_name:client_secret
    const splitSecret = clientSecret.split(':');
    // verify if secret matches configuration
    if (oauth2config.data.application_name !== splitSecret[0] || oauth2config.data.client_secret !== splitSecret[1]){
        return res.status(403).send({
            error: 'Invalid client secret.'
        });
    }
    const response = res.send({
        id_token: jwt.sign(
            {
                id: ssoRequest.user.id,
                username: ssoRequest.user.username,
                email: ssoRequest.user.email,
            },
            Vars.config.database.jwtSalt,
            {
                expiresIn: 864000
            }),
        access_token: 'not-implemented'
    });
    ssoRequest.destroy();
    return response;
}

export async function oauth2User(req: Request, res: Response): Promise<Response> {
    /**
     * Leaving this here for future implementations
     */
    Vars.loggy.log('User call', {...req.params, ...req.query});
    return res.send({email: 'user@example.com', user: 'user'});
}

export interface OAuth2ClientConfiguration {
    client_secret: string;
    application_name: string;
}
