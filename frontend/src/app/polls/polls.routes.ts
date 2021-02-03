import {RouterModule} from '@angular/router';
import { OverviewComponent } from './overview/overview.component';

export const pollsRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
]);
