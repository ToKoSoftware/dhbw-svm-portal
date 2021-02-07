import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {EventsService} from '../../services/data/events/events.service';
import {EventData} from '../../interfaces/event.interface';
import {NotificationService} from '../../services/notification/notification.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EventRegistrationService} from '../../services/data/event-registration/event-registration.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public currentEvent: EventData | null = null;
  private routeSubscription: Subscription;
  private eventId: string;

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly eventRegistrations: EventRegistrationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly events: EventsService,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('id') || '';
      this.events.read(this.eventId).subscribe(event => this.currentEvent = event, () => this.notifications.loadingFailed());
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

  public signUp(): void {
    this.loading.showLoading();
    const data = {
      event_id: this.eventId,
      body: this.formGroup.value.body
    };
    this.eventRegistrations.create(data).subscribe(
      data => {
        this.loading.hideLoading();
        this.notifications.createNotification(
          {
            id: Math.random().toString(36).substring(7),
            title: 'Erfolgreich angemeldet',
            description: 'Der Veranstalter wird sich in Kürze bei Ihnen melden!',
            type: 'info'
          }
        );
        // force reload of current user state -> reload current user's event registrations
        this.loginService.decodedJwt$.next(this.loginService.decodedJwt$.value);
        this.router.navigate(['/join']);
      }, error => {
        this.loading.hideLoading();
        this.notifications.savingFailed();
      }
    );
  }


}
