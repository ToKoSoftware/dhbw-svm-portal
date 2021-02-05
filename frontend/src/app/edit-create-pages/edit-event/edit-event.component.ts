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
        start_date: [],
        end_date: [],
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
              start_date: [d.start_date],
              end_date: [d.end_date],
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
    let eventData = {
      ...this.current,
      ...this.editEventForm.value,
    };
    eventData = setEmptyInputToNull(eventData);
    this.events.update(eventData).subscribe(
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
