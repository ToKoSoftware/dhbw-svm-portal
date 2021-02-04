import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {EventsService} from '../../services/data/events/events.service';
import {EventData} from '../../interfaces/event.interface';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  public sidebarPages = adminPages;
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(public readonly data: EventsService,
              private readonly slideOver: SlideOverService,
              private readonly titleBarService: TitleBarService) { }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Veranstaltung',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }])
  }

  public editSlide(event: EventData) {
    this.current = event.id || '';
    this.slideOver.showSlideOver('', this.edit);

  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

}

