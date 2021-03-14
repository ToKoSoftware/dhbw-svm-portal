import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../../admin.pages';
import {SlideOverService} from '../../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../../services/title-bar/title-bar.service';
import {LoadingModalService} from '../../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {EventsService} from '../../../services/data/events/events.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {EventData} from '../../../interfaces/event.interface';
import {ApiService} from '../../../services/api/api.service';
import {EventRegistrationData} from '../../../interfaces/event-registration.interface';
import {LoginService} from '../../../services/login/login.service';

@Component({
  selector: 'app-event-registrations',
  templateUrl: './event-registrations.component.html'
})
export class EventRegistrationsComponent implements OnInit {
  public sidebarPages = adminPages;
  public eventRegistrations: EventRegistrationData[] | null = null;
  public event: EventData | null = null;
  private routeSubscription: Subscription = new Subscription();
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(
    private readonly events: EventsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly api: ApiService,
    private readonly slideOver: SlideOverService,
    private readonly titleBarService: TitleBarService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService,
    private readonly login: LoginService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.loading.showLoading();
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.events.read(id).subscribe(
        data => {
          this.event = data;
          this.titleBarService.buttons$.next([
            {
              title: 'Exportieren',
              icon: 'download-cloud',
              function: () => {
                const jwt = this.login.jwt$.value;
                window.location.assign(`/api/v1/admin/export/events/${this.event?.id}/registrations?token=${jwt}`);
              }
            }]);
          this.loading.hideLoading();
        },
        error => {
          this.notification.loadingFailed();
          this.loading.hideLoading();
        }
      );
      this.api.get<EventRegistrationData[]>(`/events/${id}/event-registrations`).subscribe(
        data => {
          this.eventRegistrations = data.data;
          this.loading.hideLoading();
        },
        error => {
          this.notification.loadingFailed();
          this.loading.hideLoading();
        }
      );
    });
  }

  public togglePayment(eventRegistration: EventRegistrationData | null): void {
    if (!eventRegistration) {
      return;
    }
    this.loading.showLoading();
    const eventId = this.event?.id || '';
    this.api.put<EventRegistrationData>(`/events/${eventId}/event-registrations`, {
      user_id: eventRegistration.user.id,
      payment_done: !eventRegistration.payment_done
    }).subscribe(
      () => {
        this.notification.savedSuccessfully();
        this.loadData();
      },
      () => {
        this.loading.hideLoading();
        this.notification.savingFailed();
      },
    );
  }

  public calculateProgress(numerator: number, denominator: number): number {
    return !isNaN(numerator / denominator) ? numerator / denominator * 100 : 100;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.titleBarService.buttons$.next([]);
  }
}
