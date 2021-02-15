import {RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';

export const documentsRoutes = RouterModule.forChild([
  {path: '', component: ListComponent},
]);
