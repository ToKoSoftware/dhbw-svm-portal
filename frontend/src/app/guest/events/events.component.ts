import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {EventData} from '../../interfaces/event.interface';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit, OnDestroy {
  public orgId: string;
  public current: EventData | null = null;
  public data$: BehaviorSubject<GroupedEventData[] | null> = new BehaviorSubject([]);
  @ViewChild('details', {static: true}) details: TemplateRef<unknown>;
  private routeSubscription: Subscription = new Subscription();

  constructor(
    private readonly api: ApiService,
    private readonly activatedRoute: ActivatedRoute,
    ) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.orgId = params.get('id') || '';
      this.api.get<EventData[]>(`/organizations/${this.orgId}/public-events`).subscribe(data => {
        const events = data.data;
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
          }).sort((a, b) => a.title > b.title ? 1 : -1));
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}

interface GroupedEventData {
  title: string;
  events: EventData[];
}
