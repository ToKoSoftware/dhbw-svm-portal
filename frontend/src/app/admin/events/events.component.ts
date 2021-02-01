import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  public sidebarPages = adminPages;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;

  constructor(
    private readonly slideOver: SlideOverService,
    private readonly titleBarService: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Veranstaltung',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('Veranstaltung anlegen', this.create);
      }
    }]);
  }
}
