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
import {getOrganization, getOrganizationConfiguration, getOrganizations} from './api/v2/organizations/get-organizations';
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
import {updateOrganization, updateOrganizationConfiguration} from './api/v2/organizations/update-organization';
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
import {getForm, getForms} from './api/v2/forms/get-form';
import {createForm} from './api/v2/forms/create-form';
import {deleteForm} from './api/v2/forms/delete-form';
import {updateForm} from './api/v2/forms/update-form';
import { getOrder, getOrders } from './api/v2/orders/get-orders';
import { createOrder } from './api/v2/orders/create-order';
import { deleteOrder } from './api/v2/orders/delete-order';
import { updateOrder } from './api/v2/orders/update-order';
import { createItem } from './api/v2/items/create-item';
import { deleteItem } from './api/v2/items/delete-item';
import { updateItem } from './api/v2/items/update-item';
import { getItem, getItems } from './api/v2/items/get-items';


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
    app.post('/api/v1/login', loginUser);

    // OAuth2
    app.get('/api/v2/oauth2', userIsAuthorizedByParam, oauth2Authentication);
    app.post('/api/v2/oauth2/token', oauth2Token);
    app.post('/api/v2/oauth2/user', oauth2User);
    app.get('/api/v2/oauth2/configuration', userIsAuthorized, userIsAdmin, getOauth2Configuration);
    app.put('/api/v2/oauth2/configuration', userIsAuthorized, userIsAdmin, updateOauth2Configuration);

    /**
     * User
     */
    app.get('/api/v1/users', userIsAuthorized, getUsers);
    app.get('/api/v1/users/:id', userIsAuthorized, getUser);
    app.get('/api/v1/users/:id/direct-debit-mandates', userIsAuthorized, getDirectDebitMandate);
    app.delete('/api/v1/users/:id/direct-debit-mandates', userIsAuthorized, deleteDirectDebitMandate);
    app.post('/api/v1/users', createUser);
    app.put('/api/v1/users/:id', userIsAuthorized, updateUser);
    app.delete('/api/v1/users/:id', userIsAuthorized, userIsAdmin, deleteUser);

    /**
     * Team
     */
    app.get('/api/v2/teams', userIsAuthorized, getTeams);
    app.get('/api/v2/teams/:id', userIsAuthorized, getTeam);
    app.post('/api/v2/teams', userIsAuthorized, userIsAdmin, createTeam);
    app.post('/api/v2/teams/:id/membership', userIsAuthorized, createMembership);
    app.delete('/api/v2/teams/:id', userIsAuthorized, userIsAdmin, deleteTeam);
    app.delete('/api/v2/teams/:id/membership', userIsAuthorized, deleteMembership);
    app.put('/api/v2/teams/:id', userIsAuthorized, updateTeam);

    /**
     * News
     */
    app.get('/api/v2/news', userIsAuthorized, getAllNews);
    app.get('/api/v2/news/:id', userIsAuthorized, getSingleNews);
    app.post('/api/v2/news', userIsAuthorized, userIsAdmin, createNews);
    app.delete('/api/v2/news/:id', userIsAuthorized, userIsAdmin, deleteNews);
    app.put('/api/v2/news/:id', userIsAuthorized, userIsAdmin, updateNews);

    /**
     * Event
     */
    app.get('/api/v2/events', userIsAuthorized, getEvents);
    app.get('/api/v2/events/:id', userIsAuthorized, getEvent);
    // Get a single event registration by eventId and userId
    app.get('/api/v2/events/:event_id/event-registration', userIsAuthorized, getEventRegistration);
    // Get all event registrations for one eventId
    app.get('/api/v2/events/:event_id/event-registrations', userIsAuthorized, userIsAdmin, getEventRegistrationsFromEvent);
    // Get all event registrations for one user (or own registrations as non-admin)
    app.get('/api/v2/event-registrations', userIsAuthorized, getEventRegistrationsFromUser);
    app.post('/api/v2/events', userIsAuthorized, createEvent);
    app.post('/api/v2/events/:id/register', registerForEvent);
    app.delete('/api/v2/events/:id', userIsAuthorized, deleteEvent);
    app.delete('/api/v2/events/:event_id/event-registrations/:id', userIsAuthorized, deleteEventRegistration);
    app.put('/api/v2/events/:id', userIsAuthorized, updateEvent);
    app.put('/api/v2/events/:event_id/event-registrations', userIsAuthorized, updateEventRegistration);

    /**
     * Poll
     */
    app.get('/api/v2/polls', userIsAuthorized, getPolls);
    app.get('/api/v2/polls/:id', userIsAuthorized, getPoll);
    app.post('/api/v2/polls', userIsAuthorized, createPoll);
    app.delete('/api/v2/polls/:id', userIsAuthorized, deletePoll);
    app.put('/api/v2/polls/:id', userIsAuthorized, updatePoll);

    /**
     * PollAnswer
     */
    app.post('/api/v2/polls/:id/answers', userIsAuthorized, createPollAnswer);
    app.post('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, voteForPollAnswer);
    app.put('/api/v2/polls/:pollId/:id', userIsAuthorized, updatePollAnswer);
    app.delete('/api/v2/polls/:pollId/:id', userIsAuthorized, deletePollAnswer);
    app.delete('/api/v2/polls/:pollId/:pollAnswerId/vote', userIsAuthorized, deletePollVote);

    /**
     * Role
     */
    app.get('/api/v2/roles', userIsAuthorized, getRoles);
    app.get('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, getRole);
    app.post('/api/v2/roles', userIsAuthorized, userIsAdmin, createRole);
    app.post('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, createRoleAssignment);
    app.delete('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, deleteRole);
    app.delete('/api/v2/roles/:id/assignment', userIsAuthorized, userIsAdmin, deleteRoleAssignment);
    app.put('/api/v2/roles/:id', userIsAuthorized, userIsAdmin, updateRole);

    /**
     * Organization
     */
    app.get('/api/v2/organizations', userIsAuthorized, getOrganizations);
    app.post('/api/v2/organizations', createOrganization);
    app.get('/api/v2/organizations/:id', userIsAuthorized, getOrganization);
    app.get('/api/v2/access/:code', getOrganizationByAccessCode);
    app.put('/api/v2/organizations/:id', userIsAuthorized, userIsAdmin, updateOrganization);
    app.delete('/api/v2/organizations', userIsAuthorized, userIsAdmin, deleteOrganization);
    app.get('/api/v2/organizations/:id/public-events', getPublicEvents);
    app.get('/api/v2/organizations/:id/public-events/:eventId/register', registerForPublicEvents);

    /**
     * Config
     */
    app.get('/api/v2/organizations/:id/config', userIsAuthorized, getOrganizationConfiguration);
    app.put('/api/v2/organizations/:id/config', userIsAuthorized, updateOrganizationConfiguration);

    /**
     * Direct Debit Mandate
     */
    app.get('/api/v2/direct-debit-mandates', userIsAuthorized, userIsAdmin, getDirectDebitMandates);
    app.post('/api/v2/direct-debit-mandates', userIsAuthorized, createDirectDebitMandate);

    /**
     * Documents
     */
    app.get('/api/v2/documents', userIsAuthorized, getDocuments);
    app.get('/api/v2/documents/:fileName', userIsAuthorizedByParam, downloadDocument);
    app.post('/api/v2/documents', userIsAuthorized, userIsAdmin, uploadDocument);
    app.delete('/api/v2/documents/:fileName', userIsAuthorized, userIsAdmin, deleteDocument);
    app.get('/api/v2/ftp/configuration', userIsAuthorized, userIsAdmin, getFTPConfiguration);
    app.put('/api/v2/ftp/configuration', userIsAuthorized, userIsAdmin, updateFTPConfiguration);

    /**
     * Admin
     */
    app.get('/api/v1/admin/stats', userIsAuthorized, userIsAdmin, getStats);
    app.get('/api/v1/admin/stats/monthly', userIsAuthorized, userIsAdmin, getMonthlyStats);
    app.get('/api/v2/admin/event-logs', userIsAuthorized, userIsAdmin, getEventLogs);
    //following two routes only via frontend/browser download
    app.get('/api/v1/admin/export/users', userIsAuthorizedByParam, userIsAdmin, exportUsers);
    app.get('/api/v1/admin/export/events/:id/registrations', userIsAuthorizedByParam, userIsAdmin, exportEventRegistrations);
    app.get('/api/v1/admin/export/direct-debit-mandates', userIsAuthorizedByParam, userIsAdmin, exportDirectDebitMandates);


    /**
     * Forms
     */
    app.get('/api/v2/forms', userIsAuthorized, getForms);
    app.get('/api/v2/forms/:id', userIsAuthorized, getForm);
    app.post('/api/v2/forms', userIsAuthorized, userIsAdmin, createForm);
    app.delete('/api/v2/forms/:id', userIsAuthorized, userIsAdmin, deleteForm);
    app.put('/api/v2/forms/:id', userIsAuthorized, userIsAdmin, updateForm);

    /**
     * Orders
     */
    app.get('/api/v2/orders', userIsAuthorized, getOrders);
    app.get('/api/v2/orders/:id', userIsAuthorized, getOrder);
    app.post('/api/v2/orders', userIsAuthorized, createOrder);
    app.delete('/api/v2/orders/:id', userIsAuthorized, deleteOrder);
    app.put('/api/v2/orders/:id', userIsAuthorized, userIsAdmin, updateOrder);

    /**
     * Items
     */
    app.get('/api/v2/items', userIsAuthorized, getItems);
    app.get('/api/v2/items/:id', userIsAuthorized, getItem);
    app.post('/api/v2/items', userIsAuthorized, userIsAdmin, createItem);
    app.delete('/api/v2/items/:id', userIsAuthorized, userIsAdmin, deleteItem);
    app.put('/api/v2/items/:id', userIsAuthorized, userIsAdmin, updateItem);

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
