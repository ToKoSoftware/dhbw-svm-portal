import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview/overview.component';
import {eventsRoutes} from './events.routes';
import {UiModule} from '../ui/ui.module';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {MomentModule} from 'ngx-moment';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarModule} from 'angular-calendar';

@NgModule({
  declarations: [OverviewComponent, CalendarComponent],
  imports: [
    eventsRoutes,
    CommonModule,
    UiModule,
    MarkdownToHtmlModule,
    MomentModule,
    CalendarModule,
  ]
})
export class EventsModule {
}
