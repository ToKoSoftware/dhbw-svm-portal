import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {EventsComponent} from './events/events.component';
import {PollsComponent} from './polls/polls.component';
import {PollAnswerDetailComponent} from '../admin/polls/poll-answer-detail/poll-answer-detail.component';

export const teamsRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
  {path: 'polls', component: PollsComponent},
  {path: 'polls/:id', component: PollAnswerDetailComponent},
  {path: 'events', component: EventsComponent},
]);
