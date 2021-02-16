import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditUserComponent} from './edit-user/edit-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UiModule} from '../ui/ui.module';
import {EditEventComponent} from './edit-event/edit-event.component';
import {EditNewsComponent} from './edit-news/edit-news.component';
import {CreateNewsComponent} from './create-news/create-news.component';
import {CreateEventComponent} from './create-event/create-event.component';
import {CreatePollComponent} from './create-poll/create-poll.component';
import {EditPollComponent} from './edit-poll/edit-poll.component';
import {EditRoleComponent} from './edit-role/edit-role.component';
import {CreateRoleComponent} from './create-role/create-role.component';
import {MomentModule} from 'ngx-moment';
import {IconsModule} from '../icons/icons.module';
import { EditCreatePollAnswerComponent } from './edit-poll/edit-create-poll-answer/edit-create-poll-answer.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { EditRoleMembershipsComponent } from './edit-role-memberships/edit-role-memberships.component';
import {EditTeamMembershipsComponent} from './edit-team-memberships/edit-team-memberships.component';
import { EditDeveloperSettingsComponent } from './edit-developer-settings/edit-developer-settings.component';
import {ClipboardModule} from 'ngx-clipboard';
import {EditUserPermissionsComponent} from './edit-user-permissions/edit-user-permissions.component';
import {RouterModule} from '@angular/router';
import { EditPrivacyPolicyComponent } from './edit-privacy-policy/edit-privacy-policy.component';
import { EditDirectDebitMandateContractTextComponent } from './edit-direct-debit-mandate-contract-text/edit-direct-debit-mandate-contract-text.component';
import { EditFtpConfigComponent } from './edit-ftp-config/edit-ftp-config.component';

@NgModule({
  declarations: [
    EditUserComponent,
    EditEventComponent,
    EditNewsComponent,
    CreateNewsComponent,
    CreateEventComponent,
    CreatePollComponent,
    EditPollComponent,
    EditRoleComponent,
    CreateRoleComponent,
    EditCreatePollAnswerComponent,
    CreateTeamComponent,
    EditTeamComponent,
    EditRoleMembershipsComponent,
    EditTeamMembershipsComponent,
    EditDeveloperSettingsComponent,
    EditUserPermissionsComponent,
    EditPrivacyPolicyComponent,
    EditDirectDebitMandateContractTextComponent,
    EditFtpConfigComponent,
    EditFtpConfigComponent
  ],
  exports: [EditUserComponent, EditEventComponent, CreateNewsComponent, EditNewsComponent, EditPollComponent, CreatePollComponent,
    CreateEventComponent, CreateRoleComponent, EditRoleComponent, EditTeamComponent, CreateTeamComponent, EditRoleMembershipsComponent,
    EditTeamMembershipsComponent, EditDeveloperSettingsComponent, EditUserPermissionsComponent, EditDirectDebitMandateContractTextComponent, EditPrivacyPolicyComponent, EditFtpConfigComponent],
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    IconsModule,
    UiModule,
    RouterModule
  ]
})
export class EditCreatePagesModule {
}
