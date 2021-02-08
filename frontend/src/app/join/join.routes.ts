import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {JoinComponent} from './join/join.component';
import {IsLoggedInGuard} from '../guards/is-logged-in.guard';

export const joinRoutes = RouterModule.forChild([
  {
    path: '',
    component: OverviewComponent,
    pathMatch: 'full',
    canActivate: [IsLoggedInGuard]
  },
  {
    path: ':id',
    component: JoinComponent
  },
]);
