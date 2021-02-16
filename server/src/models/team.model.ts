import { BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, BelongsToMany, NotEmpty, PrimaryKey, Scopes, Table, DefaultScope, HasOne } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { RawTeamData } from '../interfaces/team.interface';
import { currentOrg } from './current-org.scope';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { User } from './user.model';
import { Event } from './event.model';
import { LoggedModel } from './logged.model';

@DefaultScope(() => ({
    required: false,
    order: [['title', 'ASC']]
}))

@Scopes(() => ({
    full: {
        include: [{ model: Organization, as: 'organization' }, Role, User]
    },
    ordered: {
        required: false,
        order: [['title', 'ASC']]
    },
    onlyOwnOrMaintainedTeams: (teamIds: string[], roleIds: string[]) => ({
        required: false,
        where: {
            [Op.or]: [
                { id: teamIds },
                { maintain_role_id: roleIds }
            ]
        }
    }),
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table
export class Team extends LoggedModel {

    public static modelName = 'Team';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @ForeignKey(() => Role)
    @Column
    maintain_role_id: string;

    @BelongsTo(() => Organization, 'org_id')
    organization: Organization;
    @HasOne(() => Organization, 'public_team_id')
    public_team_of_organization: Organization;
    @BelongsTo(() => Role)
    maintain_role: Role;
    @BelongsToMany(() => User, () => Membership)
    users: Array<User & { membership: Membership }>;

    @HasMany(() => Poll)
    can_answer_polls: Poll[];
    @HasMany(() => Event)
    can_participate_events: Event[];

    @BeforeCreate
    static addUuid(instance: Team): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawTeamData> {
        return [
            'title'
        ];
    }
}