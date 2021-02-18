import {RouterModule} from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";
import {CalendarComponent} from './calendar/calendar.component';

export const eventsRoutes = RouterModule.forChild([
  {path: '', component: OverviewComponent},
  {path: 'calendar', component: CalendarComponent},
]);
