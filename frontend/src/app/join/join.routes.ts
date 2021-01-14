import {RouterModule} from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";

export const joinRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
]);
