import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';
import {PollAnswerData, PollData} from '../../../interfaces/poll.interface';
import {PollsService} from '../../../services/data/polls/polls.service';
import {ModalService} from '../../../services/modal/modal.service';

@Component({
  selector: 'app-edit-create-poll-answer',
  templateUrl: './edit-create-poll-answer.component.html'
})
export class EditCreatePollAnswerComponent implements OnChanges {
  public formGroup: FormGroup;
  @Input() pollAnswer: PollAnswerData | null = null;
  @Input() poll: PollData | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private polls: PollsService,
    public customModalService: ModalService,
    private loadingModalService: LoadingModalService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
      }
    );
    if (this.pollAnswer) {
      this.formGroup = this.formBuilder.group(
        {
          title: [this.pollAnswer.title],
        }
      );
    }
  }

  public createOrUpdate() {
    this.customModalService.close();
    this.loadingModalService.showLoading();
    if (this.pollAnswer && this.poll) {
      const updateData = {...this.pollAnswer, ...this.formGroup.value};
      this.polls.updateAnswer(this.poll, updateData).subscribe(
        data => {
          this.loadingModalService.hideLoading();
          this.customModalService.close();
        },
        error => {
          this.loadingModalService.hideLoading();
          this.customModalService.open();
        },
      );
    } else if (this.poll) {
      this.polls.createAnswer(this.poll, {...this.formGroup.value}).subscribe(
        data => {
          this.loadingModalService.hideLoading();
          this.customModalService.close();
        },
        error => {
          this.loadingModalService.hideLoading();
          this.customModalService.open();
        },
      );
    }
  }
}
