import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html'
})
export class EditPollComponent implements OnInit {
  public formGroup: FormGroup;
  public current: PollData;
  @Input() editId: string = '';

  constructor(
    public readonly polls: PollsService,
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
  }

  public loadData() {
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

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.polls.update({...this.current, ...this.formGroup.value, is_active: true}).subscribe(
      data => {
        this.current = data;
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }
}
