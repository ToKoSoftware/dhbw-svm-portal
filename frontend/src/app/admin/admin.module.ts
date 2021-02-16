import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {adminRoutes} from './admin.routes';
import {UiModule} from '../ui/ui.module';
import {UsersComponent} from './users/users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconsModule} from '../icons/icons.module';
import {ChartsModule} from 'ng2-charts';
import {AdminLineStatsComponent} from './stats/admin-line-stats/admin-line-stats.component';
import {AdminPieStatsComponent} from './stats/admin-pie-stats/admin-pie-stats.component';
import {AdminReferrerStatsComponent} from './stats/admin-referrer-stats/admin-referrer-stats.component';
import {MomentModule} from 'ngx-moment';
import { EventsComponent } from './events/events.component';
import { RolesComponent } from './roles/roles.component';
import { TeamsComponent } from './teams/teams.component';
import {EditCreatePagesModule} from "../edit-create-pages/edit-create-pages.module";
import { PollsComponent } from './polls/polls.component';
import { StatsComponent } from './stats/stats.component';
import { NewsComponent } from './news/news.component';
import {PollAnswerDetailComponent} from './polls/poll-answer-detail/poll-answer-detail.component';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {TruncatePipe} from '../pipes/truncate.pipe';
import { DirectDebitMandatesComponent } from './direct-debit-mandates/direct-debit-mandates.component';
import { DocumentsComponent } from './documents/documents.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { Oauth2Component } from './oauth2/oauth2.component';

@NgModule({
  declarations: [
    OverviewComponent,
    UsersComponent,
    AdminLineStatsComponent,
    AdminPieStatsComponent,
    AdminReferrerStatsComponent,
    EventsComponent,
    RolesComponent,
    TeamsComponent,
    PollsComponent,
    StatsComponent,
    NewsComponent,
    PollAnswerDetailComponent,
    TruncatePipe,
    DirectDebitMandatesComponent,
    DocumentsComponent,
    PrivacyComponent,
    Oauth2Component
  ],
  imports: [
    adminRoutes,
    CommonModule,
    FormsModule,
    UiModule,
    IconsModule,
    ChartsModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    EditCreatePagesModule,
    MarkdownToHtmlModule,
  ]
})
export class AdminModule {
}
