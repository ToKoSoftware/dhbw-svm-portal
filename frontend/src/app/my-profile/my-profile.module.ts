import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {myProfileRoutes} from './my-profile.routes';
import {UiModule} from '../ui/ui.module';
import {MyCredentialsComponent} from './credentials/my-credentials.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconsModule} from '../icons/icons.module';
import {MomentModule} from 'ngx-moment';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {EditCreatePagesModule} from "../edit-create-pages/edit-create-pages.module";


@NgModule({
  declarations: [MyCredentialsComponent, MyProfileComponent],
  imports: [
    myProfileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
    MomentModule,
    EditCreatePagesModule
  ]
})
export class MyProfileModule {
}
