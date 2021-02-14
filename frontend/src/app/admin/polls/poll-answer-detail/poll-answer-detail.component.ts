import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../../admin.pages';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PollsService} from '../../../services/data/polls/polls.service';
import {PollData} from '../../../interfaces/poll.interface';
import {NotificationService} from '../../../services/notification/notification.service';
import {SlideOverService} from '../../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../../services/title-bar/title-bar.service';

@Component({
  selector: 'app-overview',
  templateUrl: './poll-answer-detail.component.html'
})
export class PollAnswerDetailComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  private routeSubscription: Subscription = new Subscription();
  pollId: string | null = null;
  currentPoll: PollData;
  @ViewChild('results', {static: true}) results: TemplateRef<unknown>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly polls: PollsService,
    private readonly notifications: NotificationService,
    private readonly slideOver: SlideOverService,
    private readonly titleBarService: TitleBarService
  ) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.pollId = params.get('id') || '';
      this.polls.read(this.pollId).subscribe(poll => {
        this.currentPoll = poll;
        this.slideOver.showSlideOver('Umfrageergebnisse', this.results);
      }, () => this.notifications.loadingFailed());
    });

    this.titleBarService.buttons$.next([{
      title: 'Ergebnisse anzeigen',
      icon: 'bar-chart-2',
      function: () => {
        this.slideOver.showSlideOver('Umfrageergebnisse', this.results);
      }
    }]);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

  public calculateProgress(numerator: number, denominator: number): number {
    return !isNaN(numerator / denominator) ? numerator / denominator * 100 : 100;
  }
}
