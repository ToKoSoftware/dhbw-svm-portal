import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {EventData} from '../../interfaces/event.interface';
import {EventsService} from '../../services/data/events/events.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/data/teams/team.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent implements OnInit, OnChanges {
  public editEventForm: FormGroup;
  public current: EventData;
  public teamSubscription: Subscription;
  public teamSelectData: [string | number, string | number][] = [];
  @Input() editId: string = '';

  constructor(
    public readonly events: EventsService,
    public readonly teams: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly loadingModalService: LoadingModalService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.events.read(this.editId)
      .subscribe(
        d => this.current = d,
      );
    this.editEventForm = this.formBuilder.group(
      {
        title: [],
        description: [],
        price: [],
        start_date: [],
        end_date: [],
        max_participants: [],
        allowed_team_id: [],
        is_active: [],
      }
    );
    this.teamSubscription = this.teams.data$.subscribe(teams => {
      if (teams) {
        this.teamSelectData = teams.map(t => [t.id || '', t.title]);
      }
    });
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
              allowed_team_id: [d.allowed_team_id],
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
      is_active: true
    };
    eventData = setEmptyInputToNull(eventData);
    this.events.update(eventData).subscribe(
      data => {
        this.current = data;
        this.notificationService.savedSuccessfully();
        this.router.navigate(['/my-team/events', data.id])
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
