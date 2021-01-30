import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {EventData} from '../../interfaces/event.interface';
import {EventsService} from '../../services/data/events/events.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {ButtonType} from '../../ui/button/button.component';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent implements OnInit {
  public editEventForm: FormGroup;
  public currentEvent: EventData;
  @Input() eventId: string = '';

  constructor(
    public readonly events: EventsService,
    private formBuilder: FormBuilder,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService,
    private confirm: ConfirmModalService
  ) {
  }

  ngOnInit(): void {
    this.events.read(this.eventId)
      .subscribe(
        d => this.currentEvent = d,
      );
    this.editEventForm = this.formBuilder.group(
      {
        title: [],
        description: [],
        price: [],
        date: [],
        max_participants: [],
        is_active: [],
      }
    );
  }

  public updateEvent(): void {
    if (this.editEventForm.dirty && !this.editEventForm.valid) {
      return;
    }
    const dateSplit = this.editEventForm.value.date.split(".");
    const date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0], 12, 0);
    let eventData = {
      ...this.editEventForm.value,
      ...{date: date.toISOString()}
    };
    eventData = setEmptyInputToNull(eventData);
    this.events.create(eventData).subscribe(
      data => {
        this.currentEvent = data;
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }
}
