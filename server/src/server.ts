import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Vars } from './vars';
import { wrapResponse } from './functions/response-wrapper';
import fileUpload from 'express-fileupload';
import tempDirectory from 'temp-dir';
import bodyParser from 'body-parser';
import { getUser, getUsers } from './api/v1/users/get-users';
import { createUser } from './api/v1/users/create-user';
import { deleteUser } from './api/v1/users/delete-user';
import { updateUser } from './api/v1/users/update-user';
import { loginUser } from './api/v1/users/auth-user';
import { userIsAuthorized } from './middleware/user-is-authorized.middleware';
import { userIsAdmin } from './middleware/user-is-admin.middleware';
import { userIsAuthorizedByParam } from './middleware/user-is-authorized-by-param.middleware';
import { exportUsers } from './api/v1/admin/export-users';
import { getStats } from './api/v1/admin/get-stats';
import { getMonthlyStats } from './api/v1/admin/get-monthly-stats';
import path from 'path';
import { createNews } from './api/v2/news/create-news';
import { getTeam, getTeams } from './api/v2/teams/get-teams';
import { getAllNews, getSingleNews } from './api/v2/news/get-news';
import { getEvent, getEvents } from './api/v2/events/get-events';
import { getPoll, getPolls } from './api/v2/polls/get-polls';
import { getRole, getRoles } from './api/v2/roles/get-roles';
import { getOrganization, getOrganizations } from './api/v2/organizations/get-organizations';
import { createPoll } from './api/v2/polls/create-poll';
import { createPollAnswer } from './api/v2/poll-answers/create-poll-answer';
import { createEvent } from './api/v2/events/create-event';
import { registerForEvent } from './api/v2/event-registrations/register-for-event';
import { createTeam } from './api/v2/teams/create-team';
import { createMembership } from './api/v2/team-memberships/create-membership';
import { deleteNews } from './api/v2/news/delete-news';
import { voteForPollAnswer } from './api/v2/poll-votes/create-poll-vote';
import { deleteEvent } from './api/v2/events/delete-event';
import { deleteEventRegistration } from './api/v2/event-registrations/delete-event-registration';
import { deleteTeam } from './api/v2/teams/delete-team';
import { deleteMembership } from './api/v2/team-memberships/delete-membership';
import { createRole } from './api/v2/roles/create-roles';
import { createRoleAssignment } from './api/v2/role-assignments/create-role-assignment';
import { deleteRole } from './api/v2/roles/delete-role';
import { deleteRoleAssignment } from './api/v2/role-assignments/delete-role-assignment';
import { deletePoll } from './api/v2/polls/delete-poll';
import { deletePollAnswer } from './api/v2/poll-answers/delete-poll-answer';
import { deletePollVote } from './api/v2/poll-votes/delete-poll-vote';
import { updateEvent } from './api/v2/events/update-event';
import { updateNews } from './api/v2/news/update-news';
import { updatePoll } from './api/v2/polls/update-poll';
import { updatePollAnswer } from './api/v2/poll-answers/update-poll-answer';
import { updateTeam } from './api/v2/teams/update-team';
import { updateRole } from './api/v2/roles/update-role';
import { updateOrganization } from './api/v2/organizations/update-organization';
import { oauth2Authentication, oauth2Token, oauth2User } from './api/oauth2/authenticate';
import { getOauth2Configuration, updateOauth2Configuration } from './api/oauth2/configure';
import { createOrganization } from './api/v2/organizations/create-organization';
import {
    getEventRegistration, getEventRegistrationsFromEvent,
    getEventRegistrationsFromUser
} from './api/v2/event-registrations/get-event-registrations';
import { updateEventRegistration } from './api/v2/event-registrations/update-event-registration';
import { deleteOrganization } from './api/v2/organizations/delete-organization';
import { getOrganizationByAccessCode } from './api/v2/organizations/get-organization-by-access_code';
import { createDirectDebitMandate } from './api/v2/direct-debit-mandate/create-direct-debit-mandate';
import { getDirectDebitMandate, getDirectDebitMandates } from './api/v2/direct-debit-mandate/get-direct-debit-mandate';
import { deleteDirectDebitMandate } from './api/v2/direct-debit-mandate/delete-direct-debit-mandate';
import { exportEventRegistrations } from './api/v1/admin/export-event-registrations';
import { exportDirectDebitMandates } from './api/v1/admin/export-direct-debit-mandates';
import { deleteDocument, downloadDocument, getDocuments, uploadDocument } from './api/v2/documents/get-documents';
import { getFTPConfiguration, updateFTPConfiguration } from './api/v2/documents/configure';
import { getPublicEvents } from './api/v2/events/get-public-events';
import { registerForPublicEvents } from './api/v2/event-registrations/register-for-public-event';
import { getEventLogs } from './api/v2/event-logs/get-event-logs';
import { CustomError, errorHandler } from './middleware/error-handler';

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
    app.get('/api/v1/users', userIsAuthorized, (req, res) => getUsers(req, res));
    app.get('/api/v1/users/:id', userIsAuthorized, (req, res) => getUser(req, res));
    app.get('/api/v1/users/:id/direct-debit-mandates', userIsAuthorized, (req, res) => getDirectDebitMandate(req, res));
    app.delete('/api/v1/users/:id/direct-debit-mandates', userIsAuthorized, (req, res) => deleteDirectDebitMandate(req, res));
    app.post('/api/v1/users', (req, res) => createUser(req, res));
    app.put('/api/v1/users/:id', userIsAuthorized, (req, res) => updateUser(req, res));
    app.delete('/api/v1/users/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteUser(req, res));

    /**
     * Team
     */
    app.get('/api/v2/teams', userIsAuthorized, (req, res) => getTeams(req, res));
    app.get('/api/v2/teams/:id', userIsAuthorized, (req, res) => getTeam(req, res));
    app.post('/api/v2/teams', userIsAuthorized, userIsAdmin, (req, res) => createTeam(req, res));
    app.post('/api/v2/teams/:id/membership', userIsAuthorized, (req, res) => createMembership(req, res));
    app.delete('/api/v2/teams/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteTeam(req, res));
    app.delete('/api/v2/teams/:id/membership', userIsAuthorized, (req, res) => deleteMembership(req, res));
    app.put('/api/v2/teams/:id', userIsAuthorized, (req, res) => updateTeam(req, res));

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
    app.get('/api/v2/events', userIsAuthorized, (req, res) => getEvents(req, res));
    app.get('/api/v2/events/:id', userIsAuthorized, (req, res) => getEvent(req, res));
    // Get a single event registration by eventId and userId
    app.get('/api/v2/events/:event_id/event-registration', userIsAuthorized, (req, res) => getEventRegistration(req, res));
    // Get all event registrations for one eventId

    app.get('/api/v2/events/:event_id/eventregistrations', userIsAuthorized, userIsAdmin,
        (req, res) => getEventRegistrationsFromEvent(req, res));
    // Get all event registrations for one user (or own registrations as non-admin)
    app.get('/api/v2/event-registrations', userIsAuthorized, (req, res) => getEventRegistrationsFromUser(req, res));
    app.post('/api/v2/events', userIsAuthorized, (req, res) => createEvent(req, res));
    app.post('/api/v2/events/:id/register', (req, res) => registerForEvent(req, res));
    app.delete('/api/v2/events/:id', userIsAuthorized, (req, res) => deleteEvent(req, res));
    app.delete('/api/v2/events/:event_id/event-registrations/:id', userIsAuthorized, (req, res) => deleteEventRegistration(req, res));
    app.put('/api/v2/events/:id', userIsAuthorized, (req, res) => updateEvent(req, res));
    app.put('/api/v2/events/:event_id/event-registrations', userIsAuthorized, (req, res) => updateEventRegistration(req, res));

    /**
     * Poll
     */
    app.get('/api/v2/polls', userIsAuthorized, (req, res) => getPolls(req, res));
    app.get('/api/v2/polls/:id', userIsAuthorized, (req, res) => getPoll(req, res));
    app.post('/api/v2/polls', userIsAuthorized, (req, res) => createPoll(req, res));
    app.delete('/api/v2/polls/:id', userIsAuthorized, (req, res) => deletePoll(req, res));
    app.put('/api/v2/polls/:id', userIsAuthorized, (req, res) => updatePoll(req, res));

    /**
     * PollAnswer
     */
    app.post('/api/v2/polls/:id/answers', userIsAuthorized, (req, res) => createPollAnswer(req, res));
    app.post('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, (req, res) => voteForPollAnswer(req, res));
    app.put('/api/v2/polls/:pollId/:id', userIsAuthorized, (req, res) => updatePollAnswer(req, res));
    app.delete('/api/v2/polls/:pollId/:id', userIsAuthorized, (req, res) => deletePollAnswer(req, res));
    app.delete('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, (req, res) => deletePollVote(req, res));

    /**
     * Role
     */
    app.get('/api/v2/roles', userIsAuthorized, (req, res) => getRoles(req, res));
    app.get('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => getRole(req, res));
    app.post('/api/v2/roles', userIsAuthorized, userIsAdmin, (req, res) => createRole(req, res));
    app.post('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, (req, res) => createRoleAssignment(req, res));
    app.delete('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteRole(req, res));
    app.delete('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, (req, res) => deleteRoleAssignment(req, res));
    app.put('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, (req, res) => updateRole(req, res));

    /**
     * Organization
     */
    app.get('/api/v2/organizations', userIsAuthorized, (req, res) => getOrganizations(req, res));
    app.post('/api/v2/organizations', (req, res) => createOrganization(req, res));
    app.get('/api/v2/organizations/:id', userIsAuthorized, (req, res) => getOrganization(req, res));
    app.get('/api/v2/access/:code', (req, res) => getOrganizationByAccessCode(req, res));
    app.put('/api/v2/organizations/:id', userIsAuthorized, userIsAdmin, (req, res) => updateOrganization(req, res));
    app.delete('/api/v2/organizations', userIsAuthorized, userIsAdmin, (req, res) => deleteOrganization(req, res));
    app.get('/api/v2/organizations/:id/public-events', (req, res) => getPublicEvents(req, res));
    app.get('/api/v2/organizations/:id/public-events/:eventId/register', (req, res) => registerForPublicEvents(req, res));

    /**
     * Direct Debit Mandate
     */
    app.get('/api/v2/direct-debit-mandates', userIsAuthorized, userIsAdmin, (req, res) => getDirectDebitMandates(req, res));
    app.post('/api/v2/direct-debit-mandates', userIsAuthorized, (req, res) => createDirectDebitMandate(req, res));

    /**
     * Documents
     */
    app.get('/api/v2/documents', userIsAuthorized, (req, res) => getDocuments(req, res));
    app.get('/api/v2/documents/:fileName', userIsAuthorizedByParam, (req, res) => downloadDocument(req, res));
    app.post('/api/v2/documents', userIsAuthorized, userIsAdmin, (req, res) => uploadDocument(req, res));
    app.delete('/api/v2/documents/:fileName', userIsAuthorized, userIsAdmin, (req, res) => deleteDocument(req, res));
    app.get('/api/v2/ftp/configuration', userIsAuthorized, userIsAdmin, (req, res) => getFTPConfiguration(req, res));
    app.put('/api/v2/ftp/configuration', userIsAuthorized, userIsAdmin, (req, res) => updateFTPConfiguration(req, res));

    /**
     * Admin
     */
    app.get('/api/v1/admin/stats', userIsAuthorized, userIsAdmin, (req, res) => getStats(req, res));
    app.get('/api/v1/admin/stats/monthly', userIsAuthorized, userIsAdmin, (req, res) => getMonthlyStats(req, res));
    app.get('/api/v2/admin/event-logs', userIsAuthorized, userIsAdmin, (req, res) => getEventLogs(req, res));
    //following two routes only via frontend/browser functionable with download
    app.get('/api/v1/admin/export/users', userIsAuthorizedByParam, userIsAdmin, (req, res) => exportUsers(req, res));
    app.get('/api/v1/admin/export/events/:id/registrations', userIsAuthorizedByParam, userIsAdmin,
        (req, res) => exportEventRegistrations(req, res));
    app.get('/api/v1/admin/export/direct-debit-mandates', userIsAuthorizedByParam, userIsAdmin,
        (req, res) => exportDirectDebitMandates(req, res));



    // handle every other route with index.html, which loads Angular
    app.get('*', function (request, response) {
        response.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });

    /**
     * ErrorHandler
     */
    app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => { errorHandler(err, req, res, next); });

    /**
     * Server
     */
    app.listen(PORT, () => Vars.loggy.log(`[Server] Starting on http://localhost:${PORT}`));
}
