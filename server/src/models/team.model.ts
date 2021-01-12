import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {TeamData} from '../interfaces/team.interface';
import { Organization } from './organization.model';
import { Poll } from './poll.model';

@Table
export class Team extends Model {

    @Column
    title: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;

    @HasMany(() => Poll)
    can_answer_polls: Poll[];

    public static requiredFields(): Array<keyof TeamData> {
        return [
            'title'
        ];
    }
}

// TODO Team.hasMany(Role, {foreignKey: 'maintain_role_id'});
