import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import {eventsRoutes} from "./events.routes";



@NgModule({
  declarations: [OverviewComponent],
  imports: [
    eventsRoutes,
    CommonModule
  ]
})
export class EventsModule { }
