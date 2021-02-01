import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html'
})
export class CreatePollComponent implements OnInit {
  public formGroup: FormGroup;
  public current: PollData;
  @Input() editId: string = '';

  constructor(
    public readonly polls: PollsService,
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
      }
    );
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
        this.slideOverService.close();
      },
      error => {
        this.loadingModalService.hideLoading();
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

}
