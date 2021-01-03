import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {myProfileRoutes} from './my-profile.routes';
import {UiModule} from '../ui/ui.module';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconsModule} from '../icons/icons.module';
import {MomentModule} from 'ngx-moment';


@NgModule({
  declarations: [MyCredentialsComponent],
  imports: [
    myProfileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
    MomentModule
  ]
})
export class MyProfileModule {
}
