import {Component, Input, OnInit} from '@angular/core';
import {PollAnswerData, PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
})
export class PollComponent implements OnInit {
  @Input() public poll: PollData;
  public selected = '';
  public formGroup: FormGroup;
  public answerOptions: [string | number, string | number][] = [];

  constructor(
       private readonly formBuilder: FormBuilder,
       private readonly polls: PollsService,
       private readonly loading: LoadingModalService,
       private readonly notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.answerOptions = this.poll.poll_answers.map(answer => [answer.id || '', answer.title])
    const defaultAnswer = this.poll.poll_answers.length ? this.poll.poll_answers[0].id : '';
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        answer_id: [defaultAnswer],
      }
    );
  }

  public vote() {
    this.loading.showLoading();
    this.polls.vote(this.poll, this.formGroup.value).subscribe(
      () => this.loading.hideLoading(),
      () => {
        this.notification.savingFailed('Ihre Stimme konnte nicht abgegeben werden.');
        this.loading.hideLoading();
      }
    );

  }

  public calculateProgress(numerator: number, denominator: number): number {
    return !isNaN(numerator / denominator) ? numerator / denominator * 100 : 100;
  }
}
