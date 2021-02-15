import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './users/users.component';
import {EventsComponent} from "./events/events.component";
import {RolesComponent} from "./roles/roles.component";
import {TeamsComponent} from "./teams/teams.component";
import {PollsComponent} from "./polls/polls.component";
import {StatsComponent} from "./stats/stats.component";
import {NewsComponent} from './news/news.component';
import {PollAnswerDetailComponent} from './polls/poll-answer-detail/poll-answer-detail.component';
import {DirectDebitMandatesComponent} from './direct-debit-mandates/direct-debit-mandates.component';
import {DocumentsComponent} from './documents/documents.component';

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'stats', component: StatsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: UsersComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: EventsComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'teams/:id', component: TeamsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'news/:id', component: NewsComponent},
  {path: 'polls', component: PollsComponent},
  {path: 'polls/:id', component: PollAnswerDetailComponent},
  {path: 'roles', component: RolesComponent},
  {path: 'direct-debit-mandates', component: DirectDebitMandatesComponent},
  {path: 'documents', component: DocumentsComponent},
]);
