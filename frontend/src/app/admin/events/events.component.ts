import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {EventsService} from '../../services/data/events/events.service';
import {EventData} from '../../interfaces/event.interface';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(public readonly events: EventsService,
              private readonly router: Router,
              private readonly slideOver: SlideOverService,
              private readonly confirm: ConfirmModalService,
              private readonly notifications: NotificationService,
              private readonly titleBarService: TitleBarService) { }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Veranstaltung',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }])
  }

  public editSlide(event: EventData) {
    this.current = event.id || '';
    this.slideOver.showSlideOver('', this.edit);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

  public async delete(event: Event, eventData: EventData): Promise<void> {
    event.stopPropagation();
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie "${eventData.title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm){
      return;
    }
    this.events.delete(eventData).subscribe(
      () => this.notifications.deletedSuccessfully()
    );
  }

  public openRegistrations(event: Event, eventData: EventData): void {
    event.stopPropagation();
    this.router.navigate(['my-team/events/', eventData.id, 'registrations']);
  }
}

