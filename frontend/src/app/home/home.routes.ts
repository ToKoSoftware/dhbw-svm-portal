import {RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';

export const homeRoutes = RouterModule.forChild([
  {path: '', component: HomeComponent},
]);
