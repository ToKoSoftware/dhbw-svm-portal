import { AfterCreate, AfterDestroy, AfterUpdate, Model } from 'sequelize-typescript';
import { Vars } from '../vars';
import { EventLog } from './event-log.model';

export class LoggedModel extends Model {

    public static modelName = 'notSet';
    @AfterCreate
    static async createCreateEventLog(): Promise<void> {
        this.createLogEvent('create' + this.modelName);
    }
    @AfterUpdate
    static async createUpdateEventLog(): Promise<void> {
        this.createLogEvent('update' + this.modelName);
    }
    @AfterDestroy
    static async createDeleteEventLog(): Promise<void> {
        this.createLogEvent('delete' + this.modelName);
    }

    static async createLogEvent(eventType: string): Promise<void> {
        await EventLog.create({
            user_id: Vars.currentUser.id,
            org_id: Vars.currentUser.org_id,
            success: true,
            called_function: eventType
        });
    }
}