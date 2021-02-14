import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {PollsService} from '../../services/data/polls/polls.service';
import {PollData} from '../../interfaces/poll.interface';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html'
})
export class PollsComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(public readonly polls: PollsService,
              private readonly slideOver: SlideOverService,
              private readonly titleBarService: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Umfrage',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }]);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

}
