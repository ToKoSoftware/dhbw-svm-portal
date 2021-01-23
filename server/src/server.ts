import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import fileUpload from 'express-fileupload';
import tempDirectory from 'temp-dir';
import bodyParser from 'body-parser';
import {getUser, getUsers} from './api/v1/users/get-users';
import {createUser} from './api/v1/users/create-user';
import {deleteUser} from './api/v1/users/delete-user';
import {updateUser} from './api/v1/users/update-user';
import {loginUser} from './api/v1/users/auth-user';
import {userIsAuthorized} from './middleware/user-is-authorized.middleware';
import {userIsAdmin} from './middleware/user-is-admin.middleware';
import {userIsAuthorizedByParam} from './middleware/user-is-authorized-by-param.middleware';
import {exportUsers} from './api/v1/admin/export-users';
import {getStats} from './api/v1/admin/get-stats';
import {getMonthlyStats} from './api/v1/admin/get-monthly-stats';
import path from 'path';
import { getTeam, getTeams } from './api/v2/teams/get-teams';
import { createEvent } from './api/v2/events/create-event';
import { registerForEvent } from './api/v2/events/register-for-event';


export default function startServer(): void {

    /**
     * Setup
     */
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    const PORT: string | number = process.env.PORT || 5000;
    const router = express.Router();
    app.use(router);
    app.use(express.static(path.join(__dirname, '../dist')));
    /**
     * File uploads
     */
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: tempDirectory
    }));

    /**
     * Routes
     */
    app.get('/api/v1', (req, res) => res.send(wrapResponse(true)));

    /**
     * Authing
     */
    app.post('/api/v1/login', (req, res) => loginUser(req, res));

    /**
     * User
     */
    app.get('/api/v1/users', userIsAuthorized, userIsAdmin, (req, res) => getUsers(req, res));
    app.get('/api/v1/users/:id', userIsAuthorized, (req, res) => getUser(req, res));
    app.post('/api/v1/users', (req, res) => createUser(req, res));
    app.put('/api/v1/users/:id', userIsAuthorized, (req, res) => updateUser(req, res));
    app.delete('/api/v1/users/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteUser(req, res));

    /** 
     * Team
     */
    app.get('/api/v2/teams', userIsAuthorized, userIsAdmin, (req, res) => getTeams(req, res));
    app.get('/api/v2/teams/:id', userIsAuthorized, (req, res) => getTeam(req, res));

    /** 
     * Events
     */
    app.post('/api/v2/events', userIsAuthorized, userIsAdmin, (req, res) => createEvent(req, res));
    app.post('/api/v2/events/:id/register', userIsAuthorized, (req, res) => registerForEvent(req, res));

    /**
     * Admin
     */
    app.get('/api/v1/admin/stats', userIsAuthorized, userIsAdmin, (req, res) => getStats(req, res));
    app.get('/api/v1/admin/stats/monthly', userIsAuthorized, userIsAdmin, (req, res) => getMonthlyStats(req, res));
    //following two routes only via frontend/browser functionable with download
    app.get('/api/v1/admin/export/users', userIsAuthorizedByParam, userIsAdmin, (req, res) => exportUsers(req, res));


    // handle every other route with index.html, which loads Angular
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });


    /**
     * Server
     */
    app.listen(PORT, () => Vars.loggy.log(`[Server] Starting on http://localhost:${PORT}`));
}
