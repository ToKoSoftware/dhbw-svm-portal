import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {ssoRoutes} from './sso.routes';
import {UiModule} from '../ui/ui.module';
import {IconsModule} from '../icons/icons.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    ssoRoutes,
    CommonModule,
    UiModule,
    IconsModule
  ]
})
export class SsoModule { }
