import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UiModule} from './ui/ui.module';
import {IconsModule} from './icons/icons.module';
import {ApiService} from './services/api/api.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ErrorModule} from './error/error.module';
import {MomentModule} from 'ngx-moment';
import 'moment/locale/de';
import {ChartsModule} from 'ng2-charts';
import {EditCreatePagesModule} from "./edit-create-pages/edit-create-pages.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    IconsModule,
    UiModule,
    EditCreatePagesModule,
    ErrorModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        m: 59
      }
    }),
    ChartsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}