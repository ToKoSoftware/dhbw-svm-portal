import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';

export const ssoRoutes = RouterModule.forChild([
  {path: '', component: LoginComponent},
]);
