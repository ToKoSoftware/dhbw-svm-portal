import {RouterModule} from '@angular/router';
import {EventsComponent} from './events/events.component';
import {EventJoinComponent} from './event-join/event-join.component';

export const guestRoutes = RouterModule.forChild([
  {
    path: ':id/events',
    component: EventsComponent,
  },
  {
    path: ':id/events/:eventId/join',
    component: EventJoinComponent,
  },
]);
