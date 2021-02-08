import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {EventData} from '../../interfaces/event.interface';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  public current: EventData | null = null;
  public data$: BehaviorSubject<GroupedEventData[] | null> = new BehaviorSubject([]);
  @ViewChild('details', {static: true}) details: TemplateRef<unknown>;

  constructor(private readonly currentOrgService: CurrentOrgService,
              public readonly slideOver: SlideOverService,) {
  }

  ngOnInit(): void {
    this.userSubscription = this.currentOrgService.currentUser$.subscribe(
      user => {
        if (user) {
          const eventRegistrations = user.registered_events || [];
          let grouped: { [k: string]: EventData[] } = {};
          eventRegistrations.forEach(event => {
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
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}

interface GroupedEventData {
  title: string;
  events: EventData[];
}
