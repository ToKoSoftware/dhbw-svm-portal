import {Sequelize} from 'sequelize-typescript';
import {Vars} from '../vars';
import {User} from '../models/user.model';
import { Organization } from '../models/organization.model';
import { EventRegistration } from '../models/event-registration.model';
import { Membership } from '../models/membership.model';
import { News } from '../models/news.model';
import { PollAnswer } from '../models/poll-answer.model';
import { PollVote } from '../models/poll-vote.model';
import { Poll } from '../models/poll.model';
import { RoleAssignment } from '../models/role-assignment.model';
import { Role } from '../models/role.model';
import { Team } from '../models/team.model';
import { Event } from '../models/event.model';
import {Op} from 'sequelize';


export function connectToDatabase(): void {
    try {
        const sequelize = new Sequelize({
            username: Vars.config.database.username,
            password: Vars.config.database.password,
            database: Vars.config.database.dbname,
            host: Vars.config.database.url,
            port: Number(Vars.config.database.port),
            dialect: 'postgres',
            models: [User, Organization, EventRegistration, Membership, News, Poll, PollAnswer, PollVote, RoleAssignment, Role, Team, Event]
        });
        Vars.db = sequelize;
        Vars.op = Op;
        sequelize.authenticate().then(
            () => Vars.loggy.info('Connection has been established successfully.')
        );
    } catch (error) {
        Vars.loggy.error('Unable to connect to the database:', error);
    }
}