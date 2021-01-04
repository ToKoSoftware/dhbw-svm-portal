import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './users/users.component';
import {EventsComponent} from "./events/events.component";
import {RolesComponent} from "./roles/roles.component";

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'users', component: UsersComponent},
  {path: 'events', component: EventsComponent},
  {path: 'roles', component: RolesComponent},
]);
