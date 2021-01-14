import {RouterModule} from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";

export const eventsRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
]);
