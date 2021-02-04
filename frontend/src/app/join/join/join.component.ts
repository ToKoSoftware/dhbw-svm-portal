import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {EventsService} from '../../services/data/events/events.service';
import {EventData} from '../../interfaces/event.interface';
import {NotificationService} from '../../services/notification/notification.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public currentEvent: EventData | null = null;
  private routeSubscription: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly events: EventsService,
    private readonly notifications: NotificationService,
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.events.read(id).subscribe(event => this.currentEvent = event, () => this.notifications.loadingFailed());
    });
    this.formGroup = this.formBuilder.group(
      {
        body: [],
      }
    );
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }


}
