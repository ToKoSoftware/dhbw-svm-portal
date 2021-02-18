import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {EventsService} from '../../services/data/events/events.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {EventData} from '../../interfaces/event.interface';
import {teamPages} from '../teams.pages';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CurrentOrgService} from '../../services/current-org/current-org.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit, OnDestroy {
  public sidebarPages = teamPages;
  public current: string;
  public data$: BehaviorSubject<EventData[] | null> = new BehaviorSubject(null);
  private maintainTeamSubscription: Subscription = new Subscription();
  private eventsSubscription: Subscription = new Subscription();
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(public readonly data: EventsService,
              private readonly currentOrg: CurrentOrgService,
              private readonly slideOver: SlideOverService,
              private readonly titleBarService: TitleBarService) {
  }

  ngOnInit(): void {
    this.maintainTeamSubscription = this.currentOrg.currentMaintainTeams$.subscribe(
      teams => {
        if (!teams) {
          return this.data$.next(null);
        }
        this.eventsSubscription = this.data.data$.subscribe(
          data => {
            if (!data) {
              return this.data$.next(null);
            }
            const events = data.filter((eventData: EventData) => teams.find(team => team.id === eventData.allowed_team_id) !== undefined);
            this.data$.next(
              events
            );
          }
        );
      }
    );
    this.titleBarService.buttons$.next([{
      title: 'Neue Veranstaltung',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }]);
  }

  public editSlide(event: EventData) {
    this.current = event.id || '';
    this.slideOver.showSlideOver('', this.edit);
  }

  ngOnDestroy() {
    this.maintainTeamSubscription.unsubscribe();
    this.titleBarService.buttons$.next([]);
  }

}

