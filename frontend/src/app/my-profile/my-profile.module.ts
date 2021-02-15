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
import { DirectDebitMandateComponent } from './direct-debit-mandate/direct-debit-mandate.component';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';


@NgModule({
  declarations: [MyCredentialsComponent, MyProfileComponent, DirectDebitMandateComponent],
  imports: [
    myProfileRoutes,
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
    MomentModule,
    EditCreatePagesModule,
    MarkdownToHtmlModule
  ]
})
export class MyProfileModule {
}
