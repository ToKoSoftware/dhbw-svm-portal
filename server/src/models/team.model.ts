import {BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, BelongsToMany, Model, NotEmpty, PrimaryKey, Scopes, Table, DefaultScope} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {RawTeamData} from '../interfaces/team.interface';
import { currentOrg } from './current-org.scope';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    order: [['title', 'ASC']]
}))

@Scopes(() => ({
    full: {
        include: [Organization, Role, User]
    },
    ordered: {
        required: false,
        order: [['title', 'ASC']]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table
export class Team extends Model {

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

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => Role)
    maintain_role: Role;
    @BelongsToMany(() => User, () => Membership)
    users: Array<User & {membership: Membership}>;

    @HasMany(() => Poll)
    can_answer_polls: Poll[];

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