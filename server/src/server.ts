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
import {createNews} from './api/v2/news/create-news';
import {getTeam, getTeams} from './api/v2/teams/get-teams';
import {getSingleNews, getAllNews} from './api/v2/news/get-news';
import {getEvent, getEvents} from './api/v2/events/get-events';
import {getPoll, getPolls} from './api/v2/polls/get-polls';
import {getRole, getRoles} from './api/v2/roles/get-roles';
import {getOrganization, getOrganizations} from './api/v2/organizations/get-organizations';
import {createPoll} from './api/v2/polls/create-poll';
import {createPollAnswer} from './api/v2/poll-answer/create-poll-answer';
import {createEvent} from './api/v2/events/create-event';
import {registerForEvent} from './api/v2/events/register-for-event';
import {createTeam} from './api/v2/teams/create-team';
import {createMembership} from './api/v2/teams/create-membership';
import {deleteNews} from './api/v2/news/delete-news';
import {voteForPollAnswer} from './api/v2/poll-vote/create-poll-vote';
import {deleteEvent} from './api/v2/events/delete-event';
import {deleteEventRegistration} from './api/v2/events/delete-event-registration';
import {deleteTeam} from './api/v2/teams/delete-team';
import {deleteMembership} from './api/v2/teams/delete-membership';
import {createRole} from './api/v2/roles/create-roles';
import {createRoleAssignmnet} from './api/v2/roles/create-roll-assignment';
import {deleteRole} from './api/v2/roles/delete-role';
import {deleteRoleAssignment} from './api/v2/roles/delete-role-assignment';
import {deletePoll} from './api/v2/polls/delete-poll';




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
    app.post('/api/v2/teams', userIsAuthorized, userIsAdmin, (req, res) => createTeam(req, res));
    app.post('/api/v2/teams/:id/membership', userIsAuthorized, (req, res) => createMembership(req, res));
    app.delete('/api/v2/teams/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteTeam(req, res));
    app.delete('/api/v2/teams/:team_id/memberships/:id', userIsAuthorized, (req, res) => deleteMembership(req, res));
    
    /** 
     * News
     */
    app.get('/api/v2/news', userIsAuthorized, userIsAdmin, (req, res) => getAllNews(req, res));
    app.get('/api/v2/news/:id', userIsAuthorized, (req, res) => getSingleNews(req, res));
    app.post('/api/v2/news', userIsAuthorized, userIsAdmin, (req, res) => createNews(req, res));
    app.delete('/api/v2/news/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteNews(req, res));

    /** 
     * Event
     */
    app.get('/api/v2/events', userIsAuthorized, userIsAdmin, (req, res) => getEvents(req, res));
    app.get('/api/v2/events/:id', userIsAuthorized, (req, res) => getEvent(req, res));
    app.post('/api/v2/events', userIsAuthorized, userIsAdmin, (req, res) => createEvent(req, res));
    app.post('/api/v2/events/:id/register', userIsAuthorized, (req, res) => registerForEvent(req, res));
    app.delete('/api/v2/events/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteEvent(req, res));
    app.delete('/api/v2/events/:event_id/eventregistrations/:id', userIsAuthorized, (req, res) => deleteEventRegistration(req, res));

    /** 
     * Poll
     */
    app.get('/api/v2/polls', userIsAuthorized, userIsAdmin, (req, res) => getPolls(req, res));
    app.get('/api/v2/polls/:id', userIsAuthorized, (req, res) => getPoll(req, res));
    app.post('/api/v2/polls', userIsAuthorized, userIsAdmin, (req, res) => createPoll(req, res));
    app.post('/api/v2/polls/:id/answers', userIsAuthorized, userIsAdmin, (req, res) => createPollAnswer(req, res));
    app.post('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, (req, res) => voteForPollAnswer(req, res));
    app.delete('/api/v2/polls/:id', userIsAuthorized, userIsAdmin, (req, res) => deletePoll(req, res));

    /** 
     * Role
     */
    app.get('/api/v2/roles', userIsAuthorized, userIsAdmin, (req, res) => getRoles(req, res));
    app.get('/api/v2/roles/:id', userIsAuthorized, (req, res) => getRole(req, res));
    app.post('/api/v2/roles', userIsAuthorized, userIsAdmin, (req, res) => createRole(req, res));
    app.post('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, (req, res) => createRoleAssignmnet(req, res));
    app.delete('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteRole(req, res));
    app.delete('/api/v2/roles/:role_id/assignments/:id', userIsAuthorized, userIsAdmin,(req, res) => deleteRoleAssignment(req, res));
    
    /** 
     * Organization
     */
    app.get('/api/v2/organizations', userIsAuthorized, userIsAdmin, (req, res) => getOrganizations(req, res));
    app.get('/api/v2/organizations/:id', userIsAuthorized, (req, res) => getOrganization(req, res));
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
