import {Component, Input, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollAnswerData, PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {ModalService} from '../../services/modal/modal.service';
import {Subscription} from 'rxjs';

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

  constructor(
    public readonly polls: PollsService,
    public customModalService: ModalService,
    private formBuilder: FormBuilder,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
      }
    );
    this.loadData();
    this.pollSubscription = this.polls.data$.subscribe(d => this.loadData());
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
    this.polls.update({...this.current, ...this.formGroup.value, is_active: true}).subscribe(
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
  }
}
