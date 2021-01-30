import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {eventsRoutes} from './events.routes';
import {UiModule} from '../ui/ui.module';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {MomentModule} from 'ngx-moment';
@NgModule({
  declarations: [OverviewComponent],
  imports: [
    eventsRoutes,
    CommonModule,
    UiModule,
    MarkdownToHtmlModule,
    MomentModule
  ]
})
export class EventsModule {
}
