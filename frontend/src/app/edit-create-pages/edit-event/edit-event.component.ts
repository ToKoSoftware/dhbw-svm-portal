import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {EventData} from '../../interfaces/event.interface';
import {EventsService} from '../../services/data/events/events.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent implements OnInit, OnChanges {
  public editEventForm: FormGroup;
  public current: EventData;
  @Input() editId: string = '';

  constructor(
    public readonly events: EventsService,
    private formBuilder: FormBuilder,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService,
    private confirm: ConfirmModalService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
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
    this.events.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.editEventForm = this.formBuilder.group(
            {
              title: [d.title],
              description: [d.description],
              price: [d.price],
              date: [d.date],
              max_participants: [d.max_participants],
              is_active: [d.is_active],
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public updateEvent(): void {
    if (this.editEventForm.dirty && !this.editEventForm.valid) {
      return;
    }
    const dateSplit = this.editEventForm.value.date.split('.');
    const date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0], 12, 0);
    let eventData = {
      ...this.editEventForm.value,
      ...{date: date.toISOString()}
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editId !== this.current?.id)
      this.loadData();
  }

}
