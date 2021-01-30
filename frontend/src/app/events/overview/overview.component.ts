import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventsService} from '../../services/data/events/events.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {EventData} from '../../interfaces/event.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit, OnDestroy {
  private eventSubscription: Subscription;
  public data$: BehaviorSubject<GroupedEventData[] | null> = new BehaviorSubject([]);

  constructor(private events: EventsService) {
  }

  ngOnInit(): void {
    this.eventSubscription = this.events.data$.subscribe(events => {
      if (events) {
        let grouped: { [k: string]: EventData[] } = {};
        events.forEach(event => {
          const title = new Date(event.date).getFullYear();
          if (title in grouped) {
            grouped[title].push(event);
          } else {
            grouped[title] = [event];
          }
        });

        this.data$.next(Object.keys(grouped).map(key => {
          return {
            title: key,
            events: grouped[key] as EventData[]
          };
        }).sort((a,b) => a.title > b.title ? 1 : -1));
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

}

interface GroupedEventData {
  title: string;
  events: EventData[];
}
