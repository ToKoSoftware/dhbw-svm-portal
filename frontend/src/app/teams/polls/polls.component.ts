import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { PollData } from 'src/app/interfaces/poll.interface';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import {PollsService} from '../../services/data/polls/polls.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {teamPages} from '../teams.pages';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CurrentOrgService} from '../../services/current-org/current-org.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html'
})
export class PollsComponent implements OnInit, OnDestroy {
  public sidebarPages = teamPages;
  public current: string;
  private maintainTeamSubscription: Subscription = new Subscription();
  private pollsSubscription: Subscription = new Subscription();
  public data$: BehaviorSubject<PollData[] | null> = new BehaviorSubject(null);
  @ViewChild('create', {static: true}) pollCreate: TemplateRef<unknown>;

  constructor(public readonly polls: PollsService,
              private readonly slideOver: SlideOverService,
              private readonly currentOrg: CurrentOrgService,
              private readonly confirm: ConfirmModalService,
              private readonly notifications: NotificationService,
              private readonly titleBarService: TitleBarService) {
  }

  ngOnInit(): void {
    this.maintainTeamSubscription = this.currentOrg.currentMaintainTeams$.subscribe(
      teams => {
        if (!teams) {
          return this.data$.next(null);
        }
        this.pollsSubscription = this.polls.data$.subscribe(
          data => {
            if (!data) {
              return this.data$.next(null);
            }
            const polls = data.filter((pollData: PollData) => teams.find(team => team.id === pollData.answer_team_id) !== undefined);
            this.data$.next(
              polls
            );
          }
        );
      }
    );
    this.titleBarService.buttons$.next([{
      title: 'Neue Umfrage',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.pollCreate);
      }
    }]);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

  public async delete(event: Event, poll: PollData): Promise<boolean> {
    event.stopPropagation();
    event.preventDefault();
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie "${poll.title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm){
      return false;
    }
    this.polls.delete(poll).subscribe(
      () => this.notifications.deletedSuccessfully()
    );
    return false;
  }

}
