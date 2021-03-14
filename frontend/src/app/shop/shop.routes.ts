import {RouterModule} from '@angular/router';
import { OverviewComponent } from './overview/overview.component';

export const shopRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
]);
