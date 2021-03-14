import {RouterModule} from '@angular/router';
import {AboutComponent} from './about/about.component';

export const aboutRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: AboutComponent},
]);
