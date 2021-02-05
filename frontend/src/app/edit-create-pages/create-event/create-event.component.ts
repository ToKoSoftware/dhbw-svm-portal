import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EventData} from '../../interfaces/event.interface';
import {EventsService} from '../../services/data/events/events.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent implements OnInit {
  public formGroup: FormGroup;
  public current: EventData;

  constructor(
    public readonly events: EventsService,
    private formBuilder: FormBuilder,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        description: [],
        price: [],
        start_date: [],
        end_date: [],
        max_participants: [],
        is_active: [],
      }
    );
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    let eventData = {
      ...this.formGroup.value,
      is_active: true
    };
    eventData = setEmptyInputToNull(eventData);
    this.events.create(eventData).subscribe(
      data => {
        this.current = data;
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }
}
