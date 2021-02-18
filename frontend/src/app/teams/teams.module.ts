import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import {teamsRoutes} from './teams.routes';
import {UiModule} from '../ui/ui.module';
import { EventsComponent } from './events/events.component';
import { PollsComponent } from './polls/polls.component';
import {MomentModule} from 'ngx-moment';
import {EditCreatePagesModule} from '../edit-create-pages/edit-create-pages.module';
import {IconsModule} from '../icons/icons.module';
import { PollAnswerDetailComponent } from './polls/poll-answer-detail/poll-answer-detail.component';



@NgModule({
  declarations: [OverviewComponent, EventsComponent, PollsComponent, PollAnswerDetailComponent],
  imports: [
    CommonModule,
    teamsRoutes,
    UiModule,
    MomentModule,
    EditCreatePagesModule,
    IconsModule
  ]
})
export class TeamsModule { }
