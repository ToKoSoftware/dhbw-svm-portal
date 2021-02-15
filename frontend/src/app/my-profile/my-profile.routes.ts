import {RouterModule} from '@angular/router';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {DirectDebitMandateComponent} from './direct-debit-mandate/direct-debit-mandate.component';

export const myProfileRoutes = RouterModule.forChild([
  {path: '', component: MyProfileComponent},
  {path: 'credentials', component: MyCredentialsComponent},
  {path: 'direct-debit-mandates', component: DirectDebitMandateComponent},
]);
