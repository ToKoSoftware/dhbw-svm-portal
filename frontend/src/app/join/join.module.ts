import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {joinRoutes} from './join.routes';
import {UiModule} from '../ui/ui.module';
import {MomentModule} from 'ngx-moment';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import { JoinComponent } from './join/join.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [OverviewComponent, JoinComponent],
  imports: [
    joinRoutes,
    CommonModule,
    MomentModule,
    MarkdownToHtmlModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JoinModule {
}
