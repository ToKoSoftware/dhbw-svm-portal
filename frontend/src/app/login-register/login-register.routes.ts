import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {LogoutComponent} from './logout/logout.component';
import {CreateOrgComponent} from './create-org/create-org.component';

export const loginRegisterRoutes = RouterModule.forChild([
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'join', component: CreateOrgComponent},
  {path: 'logout', component: LogoutComponent},
]);
