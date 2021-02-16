import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EventData} from '../../interfaces/event.interface';
import {EventsService} from '../../services/data/events/events.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/data/teams/team.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent implements OnInit {
  public formGroup: FormGroup;
  public current: EventData;
  public teamSubscription: Subscription;
  public teamSelectData: [string | number, string | number][] = [];

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
    this.formGroup = this.formBuilder.group(
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
        this.teamSelectData.unshift(['public', 'Jeder (auch Vereinsexterne)']);
      }
    });
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
    eventData.price = eventData.price == null 
      ? eventData.price 
      : Math.round(Number(eventData.price.replace(',', '.'))*100 + Number.EPSILON);
    this.events.create(eventData).subscribe(
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

  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
  }

}
