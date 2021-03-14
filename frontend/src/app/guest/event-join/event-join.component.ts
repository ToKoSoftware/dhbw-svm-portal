import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EventData} from '../../interfaces/event.interface';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';
import {EventRegistrationService} from '../../services/data/event-registration/event-registration.service';
import {NotificationService} from '../../services/notification/notification.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ApiService} from '../../services/api/api.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';

@Component({
  selector: 'app-event-join',
  templateUrl: './event-join.component.html'
})
export class EventJoinComponent implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public currentEvent: EventData | null = null;
  private routeSubscription: Subscription;
  private eventId: string;

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly eventRegistrations: EventRegistrationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly api: ApiService,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('eventId') || '';
      const currentOrg = params.get('id') || '';
      this.api.get<EventData[]>(`/organizations/${currentOrg}/public-events/`).subscribe(
        event => this.currentEvent = event.data.find(el => el.id === this.eventId) || null,
        () => this.notifications.loadingFailed()
      );
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
        this.notifications.savingFailed(error.error.data.error);
      }
    );
  }


}
