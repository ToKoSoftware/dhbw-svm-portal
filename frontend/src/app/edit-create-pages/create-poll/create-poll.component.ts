import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {TeamService} from '../../services/data/teams/team.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html'
})
export class CreatePollComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public current: PollData;
  public teamSubscription: Subscription;
  public teamSelectData: [string | number, string | number][] = [];
  @Input() editId: string = '';
  @Input() redirectUrl: string = '/my-team/polls';

  constructor(
    public readonly polls: PollsService,
    public readonly teams: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly slideOverService: SlideOverService,
    private readonly loadingModalService: LoadingModalService,
    private readonly router: Router,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.polls.read(this.editId)
      .subscribe(
        d => this.current = d,
      );
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
        answer_team_id: [],
        closes_at: [],
      }
    );
    this.teamSubscription = this.teams.data$.subscribe(teams => {
      if (teams) {
        this.teamSelectData = teams.map(t => [t.id || '', t.title]);
      }
    });
  }

  public create(): void {
    console.log(this.formGroup.value);
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.loadingModalService.showLoading();
    this.polls.create({...this.formGroup.value}).subscribe(
      data => {
        this.current = data;
        this.loadingModalService.hideLoading();
        this.notificationService.savedSuccessfully();
        this.notificationService.createNotification({
          id: Math.random().toString(36).substring(7),
          title: `Umfrage "${this.formGroup.value.title}" angelegt`,
          description: 'Fügen Sie nun Antwortmöglichkeiten hinzu.',
          type: 'warning'
        }, null);
        this.router.navigate([this.redirectUrl, data.id])
      },
      error => {
        this.loadingModalService.hideLoading();
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
  }


}
