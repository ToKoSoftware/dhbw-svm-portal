import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {TeamService} from '../../services/data/teams/team.service';
import {Subscription} from 'rxjs';

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

  constructor(
    public readonly polls: PollsService,
    public readonly teams: TeamService,
    private formBuilder: FormBuilder,
    private slideOverService: SlideOverService,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService) {
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
        answer_team_id: ['bbbbbbbb-ed27-4c69-8e45-77416965091f'],
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
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.loadingModalService.showLoading();
    this.polls.create({...this.formGroup.value, is_active: true}).subscribe(
      data => {
        this.current = data;
        this.loadingModalService.hideLoading();
        this.notificationService.savedSuccessfully();
        this.notificationService.createNotification({
          id: Math.random().toString(36).substring(7),
          title: `Umfrage ${this.formGroup.value.title} angelegt`,
          description: 'Bearbeiten Sie die Umfrage, um Antwortmöglichkeiten hinzuzufügen',
          type: 'warning'
        }, null);
        this.slideOverService.close();
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
