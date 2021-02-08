import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {EventsService} from '../../services/data/events/events.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {EventData} from '../../interfaces/event.interface';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
  .test * {
    word-break: break-all;
  }
  `]
})
export class OverviewComponent implements OnInit, OnDestroy {
  private eventSubscription: Subscription;
  public current: EventData | null = null;
  public data$: BehaviorSubject<GroupedEventData[] | null> = new BehaviorSubject([]);
  @ViewChild('details', {static: true}) details: TemplateRef<unknown>;

  constructor(private readonly events: EventsService,
              public readonly slideOver: SlideOverService,) {
  }

  ngOnInit(): void {
    this.eventSubscription = this.events.data$.subscribe(events => {
      if (events) {
        let grouped: { [k: string]: EventData[] } = {};
        events.forEach(event => {
          const title = new Date(event.start_date).getFullYear();
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
