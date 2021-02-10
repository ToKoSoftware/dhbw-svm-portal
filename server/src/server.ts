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
import {getAllNews, getSingleNews} from './api/v2/news/get-news';
import {getEvent, getEvents} from './api/v2/events/get-events';
import {getPoll, getPolls} from './api/v2/polls/get-polls';
import {getRole, getRoles} from './api/v2/roles/get-roles';
import {getOrganization, getOrganizations} from './api/v2/organizations/get-organizations';
import {createPoll} from './api/v2/polls/create-poll';
import {createPollAnswer} from './api/v2/poll-answers/create-poll-answer';
import {createEvent} from './api/v2/events/create-event';
import {registerForEvent} from './api/v2/events/register-for-event';
import {createTeam} from './api/v2/teams/create-team';
import {createMembership} from './api/v2/teams/create-membership';
import {deleteNews} from './api/v2/news/delete-news';
import {voteForPollAnswer} from './api/v2/poll-votes/create-poll-vote';
import {deleteEvent} from './api/v2/events/delete-event';
import {deleteEventRegistration} from './api/v2/events/delete-event-registration';
import {deleteTeam} from './api/v2/teams/delete-team';
import {deleteMembership} from './api/v2/teams/delete-membership';
import {createRole} from './api/v2/roles/create-roles';
import {createRoleAssignmnet} from './api/v2/roles/create-role-assignment';
import {deleteRole} from './api/v2/roles/delete-role';
import {deleteRoleAssignment} from './api/v2/roles/delete-role-assignment';
import {deletePoll} from './api/v2/polls/delete-poll';
import {deletePollAnswer} from './api/v2/poll-answers/delete-poll-answer';
import {deletePollVote} from './api/v2/poll-votes/delete-poll-vote';
import {updateEvent} from './api/v2/events/update-event';
import {updateNews} from './api/v2/news/update-news';
import {updatePoll} from './api/v2/polls/update-poll';
import {updatePollAnswer} from './api/v2/poll-answers/update-poll-answer';
import {updateTeam} from './api/v2/teams/update-team';
import {updateRole} from './api/v2/roles/update-role';
import {updateOrganization} from './api/v2/organizations/update-organization';
import {oauth2Authentication, oauth2Token, oauth2User} from './api/oauth2/authenticate';
import {getOauth2Configuration, updateOauth2Configuration} from './api/oauth2/configure';

export default function startServer(): void {

    /**
     * Setup
     */
    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded());
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
     * Authentication
     */
    app.post('/api/v1/login', (req, res) => loginUser(req, res));

    // OAuth2
    app.get('/api/v2/oauth2', userIsAuthorizedByParam, (req, res) => oauth2Authentication(req, res));
    app.post('/api/v2/oauth2/token', (req, res) => oauth2Token(req, res));
    app.post('/api/v2/oauth2/user', (req, res) => oauth2User(req, res));
    app.get('/api/v2/oauth2/configuration', userIsAuthorized, userIsAdmin, (req, res) => getOauth2Configuration(req, res));
    app.put('/api/v2/oauth2/configuration', userIsAuthorized, userIsAdmin, (req, res) => updateOauth2Configuration(req, res));

    /**
     * User
     */
    app.get('/api/v1/users', userIsAuthorized, userIsAdmin, (req, res) => getUsers(req, res));
    app.get('/api/v1/users/:id', userIsAuthorized, (req, res) => getUser(req, res));
    app.post('/api/v1/users', (req, res) => createUser(req, res));
    app.put('/api/v1/users/:id', userIsAuthorized, (req, res) => updateUser(req, res)); //Admin: jeden, jeder User nur sich selbst sonst forbidden
    app.delete('/api/v1/users/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteUser(req, res));

    /**
     * Team
     */
    app.get('/api/v2/teams', userIsAuthorized, (req, res) => getTeams(req, res)); //Admin alle, User die, in denen er drin ist oder maintain_role_id hat
    app.get('/api/v2/teams/:id', userIsAuthorized, (req, res) => getTeam(req, res)); //Admin alle, User nur wenn er drin ist oder maintain_role_id hat, sonst forbidden
    app.post('/api/v2/teams', userIsAuthorized, userIsAdmin, (req, res) => createTeam(req, res));
    app.post('/api/v2/teams/:id/membership', userIsAuthorized, (req, res) => createMembership(req, res));
    app.delete('/api/v2/teams/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteTeam(req, res));
    app.delete('/api/v2/teams/:team_id/membership', userIsAuthorized, (req, res) => deleteMembership(req, res)); //Admin alle, User nur eigene oder maintain_role_id hat
    app.put('/api/v2/teams/:id', userIsAuthorized, userIsAdmin, (req, res) => updateTeam(req, res));

    /**
     * News
     */
    app.get('/api/v2/news', userIsAuthorized, (req, res) => getAllNews(req, res));
    app.get('/api/v2/news/:id', userIsAuthorized, (req, res) => getSingleNews(req, res));
    app.post('/api/v2/news', userIsAuthorized, userIsAdmin, (req, res) => createNews(req, res));
    app.delete('/api/v2/news/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteNews(req, res));
    app.put('/api/v2/news/:id', userIsAuthorized, userIsAdmin, (req, res) => updateNews(req, res));

    /**
     * Event
     */
    app.get('/api/v2/events', (req, res) => getEvents(req, res)); //Sehen darf jeder
    app.get('/api/v2/events/:id', (req, res) => getEvent(req, res)); //Sehen darf jeder
    app.post('/api/v2/events', userIsAuthorized, userIsAdmin, (req, res) => createEvent(req, res));
    app.post('/api/v2/events/:id/register', (req, res) => registerForEvent(req, res)); //Jeder User darf anmelden
    app.delete('/api/v2/events/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteEvent(req, res));
    app.delete('/api/v2/events/:event_id/eventregistrations/:id', userIsAuthorized, (req, res) => deleteEventRegistration(req, res)); //Admin alle, User nur eigene.
    app.put('/api/v2/events/:id', userIsAuthorized, userIsAdmin, (req, res) => updateEvent(req, res));

    /**
     * Poll
     */
    app.get('/api/v2/polls', userIsAuthorized, (req, res) => getPolls(req, res)); //Admin alle, User nur wenn answer_team_id
    app.get('/api/v2/polls/:id', userIsAuthorized, (req, res) => getPoll(req, res)); //Admin alle, User nur wenn answer_team_id
    app.post('/api/v2/polls', userIsAuthorized, userIsAdmin, (req, res) => createPoll(req, res));
    app.post('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, (req, res) => voteForPollAnswer(req, res));
    app.delete('/api/v2/polls/:id', userIsAuthorized, userIsAdmin, (req, res) => deletePoll(req, res));
    app.delete('/api/v2/polls/:pollId/:pollAnswerId/votes/:id', userIsAuthorized, (req, res) => deletePollVote(req, res)); //Nur User eigene. Admin darf nicht!
    app.put('/api/v2/polls/:id', userIsAuthorized, userIsAdmin, (req, res) => updatePoll(req, res));

    /**
     * PollAnswer
     */
    app.post('/api/v2/polls/:id/answers', userIsAuthorized, userIsAdmin, (req, res) => createPollAnswer(req, res));
    app.post('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, (req, res) => voteForPollAnswer(req, res));
    app.put('/api/v2/pollAnswers/:id', userIsAuthorized, userIsAdmin, (req, res) => updatePollAnswer(req, res));
    app.delete('/api/v2/polls/:pollId/answers/:id', userIsAuthorized, userIsAdmin, (req, res) => deletePollAnswer(req, res));
    
    /**
     * Role
     */
    app.get('/api/v2/roles', userIsAuthorized, userIsAdmin, (req, res) => getRoles(req, res)); 
    app.get('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => getRole(req, res));
    app.post('/api/v2/roles', userIsAuthorized, userIsAdmin, (req, res) => createRole(req, res));
    app.post('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, (req, res) => createRoleAssignmnet(req, res));
    app.delete('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteRole(req, res));
    app.delete('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, (req, res) => deleteRoleAssignment(req, res));
    app.put('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => updateRole(req, res));

    /**
     * Organization
     */
    app.get('/api/v2/organizations', userIsAuthorized, (req, res) => getOrganizations(req, res));
    app.get('/api/v2/organizations/:id', userIsAuthorized, (req, res) => getOrganization(req, res));
    app.put('/api/v2/organizations/:id', userIsAuthorized, userIsAdmin, (req, res) => updateOrganization(req, res));

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
