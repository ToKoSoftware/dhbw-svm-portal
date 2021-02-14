import {Component, Input} from '@angular/core';
import {PollAnswerData, PollData} from '../../interfaces/poll.interface';
import {PollsService} from '../../services/data/polls/polls.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
})
export class PollComponent {
  @Input() public poll: PollData;

  constructor(
    private readonly polls: PollsService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService
  ) {
  }

  public vote(pollAnswer: PollAnswerData) {
    this.loading.showLoading();
    this.polls.vote(this.poll, pollAnswer).subscribe(
      () => this.loading.hideLoading(),
      () => {
        this.notification.savingFailed('Ihre Stimme konnte nicht abgegeben werden.');
        this.loading.hideLoading();
      }
    );

  }

  public calculateProgress(numerator: number, denominator: number): number {
    return !isNaN(numerator / denominator)? numerator / denominator * 100 : 100;
  }
}
