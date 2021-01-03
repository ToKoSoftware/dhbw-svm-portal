import {RouterModule} from '@angular/router';
import {MyCredentialsComponent} from './credentials/my-credentials.component';

export const myProfileRoutes = RouterModule.forChild([
  {path: '', component: MyCredentialsComponent},
]);
