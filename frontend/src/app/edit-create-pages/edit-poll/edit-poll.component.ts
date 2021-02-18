import {Component, Input, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollAnswerData, PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {ModalService} from '../../services/modal/modal.service';
import {Subscription} from 'rxjs';
import {TeamService} from '../../services/data/teams/team.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html'
})
export class EditPollComponent implements OnInit, OnDestroy {
  @Input() editId: string = '';
  @ViewChild('editCreatePollAnswer', {static: true}) editPoll: TemplateRef<unknown>;
  private pollSubscription: Subscription;
  public formGroup: FormGroup;
  public current: PollData;
  public currentAnswer: PollAnswerData | null = null;
  public teamSelectData: [string | number, string | number][] = [];
  private teamSubscription: Subscription;

  constructor(
    public readonly polls: PollsService,
    public readonly customModalService: ModalService,
    private readonly formBuilder: FormBuilder,
    private readonly teams: TeamService,
    private readonly confirm: ConfirmModalService,
    private readonly loadingModalService: LoadingModalService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
        answer_team_id: [],
        closes_at: [],
      }
    );
    this.loadData();
    this.pollSubscription = this.polls.data$.subscribe(d => this.loadData());
    this.teamSubscription = this.teams.data$.subscribe(teams => {
      if (teams) {
        this.teamSelectData = teams.map(t => [t.id || '', t.title]);
      }
    });
  }

  public loadData() {
    this.loadingModalService.showLoading();
    this.polls.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.formGroup = this.formBuilder.group(
            {
              title: [d.title],
              body: [d.body],
              answer_team_id: [d.answer_team?.id],
              closes_at: [d.closes_at],
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public update(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.polls.update({...this.current, ...this.formGroup.value}).subscribe(
      data => {
        this.current = data;
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editId !== this.current?.id)
      this.loadData();
  }

  ngOnDestroy(): void {
    this.pollSubscription.unsubscribe();
    this.teamSubscription.unsubscribe();
  }

  public async deleteAnswer(event: Event, pollAnswer: PollAnswerData): Promise<void> {
    event.stopPropagation();
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie "${pollAnswer.title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm){
      return;
    }
    this.polls.deleteAnswer(this.current, pollAnswer).subscribe();
  }
}
