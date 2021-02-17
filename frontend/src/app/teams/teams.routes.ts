import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {EventsComponent} from './events/events.component';
import {PollsComponent} from './polls/polls.component';

export const teamsRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
  {path: 'polls', component: PollsComponent},
  {path: 'events', component: EventsComponent},
]);
