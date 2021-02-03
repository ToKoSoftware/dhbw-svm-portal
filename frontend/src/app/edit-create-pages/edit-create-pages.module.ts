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
  ],
  exports: [EditUserComponent, EditEventComponent, CreateNewsComponent, EditNewsComponent, EditPollComponent, CreatePollComponent, CreateEventComponent, CreateRoleComponent, EditRoleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    IconsModule,
    UiModule
  ]
})
export class EditCreatePagesModule {
}
