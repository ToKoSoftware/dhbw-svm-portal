import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import {eventsRoutes} from "./events.routes";
import {UiModule} from '../ui/ui.module';



@NgModule({
  declarations: [OverviewComponent],
    imports: [
        eventsRoutes,
        CommonModule,
        UiModule
    ]
})
export class EventsModule { }
