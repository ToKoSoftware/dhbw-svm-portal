import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import {guestRoutes} from './guest.routes';
import {MomentModule} from 'ngx-moment';
import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {UiModule} from '../ui/ui.module';
import { EventJoinComponent } from './event-join/event-join.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [EventsComponent, EventJoinComponent],
  imports: [
    CommonModule,
    guestRoutes,
    MomentModule,
    MarkdownToHtmlModule,
    UiModule,
    ReactiveFormsModule
  ]
})
export class GuestModule { }
