import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './users/users.component';
import {EventsComponent} from "./events/events.component";
import {RolesComponent} from "./roles/roles.component";
import {TeamsComponent} from "./teams/teams.component";
import {PollsComponent} from "./polls/polls.component";
import {StatsComponent} from "./stats/stats.component";

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'stats', component: StatsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id', component: UsersComponent},
  {path: 'events', component: UsersComponent},
  {path: 'events/:id', component: UsersComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'teams/:id', component: TeamsComponent},
  {path: 'polls', component: PollsComponent},
  {path: 'polls/:id', component: PollsComponent},
  {path: 'events', component: EventsComponent},
  {path: 'roles', component: RolesComponent},
]);
