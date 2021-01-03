import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {UsersComponent} from './users/users.component';

export const adminRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: OverviewComponent},
  {path: 'users', component: UsersComponent},
]);
