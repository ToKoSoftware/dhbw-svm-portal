import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {ApiService} from '../../services/api/api.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {EventLogData} from '../../interfaces/event-log.interface';

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html'
})
export class EventLogComponent implements OnInit {
  public sidebarPages = adminPages;
  public logs: EventLogData[] | null = null;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(
    private readonly api: ApiService,
    private readonly slideOver: SlideOverService,
    private readonly titleBarService: TitleBarService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.loading.showLoading();
    this.api.get<EventLogData[]>('/admin/event-logs').subscribe(data => {
      this.logs = data.data;
      this.loading.hideLoading();
    });
  }

  public getTextForFunction(functionName: string): string {
    const splitFunction = functionName.split(/(?=[A-Z])/);
    const entities: Array<[string, string]> = [
      ['Team', 'ein Team'],
      ['Event', 'eine Veranstaltung'],
      ['Poll', 'eine Umfrage'],
      ['Role', 'eine Rolle'],
      ['News', 'eine Nachricht'],
      ['Organization', 'ihren Verein'],
    ];
    const foundEntity: [string, string] | undefined = entities.find(f => f[0] === splitFunction[1]);
    const entity: string = foundEntity?.length === 2 ? foundEntity[1] : '';

    switch (splitFunction[0]) {
      case 'update':
        return `Hat ${entity} bearbeitet`;
      case 'create':
        return `Hat ${entity} erstellt`;
      case 'delete':
        return `Hat ${entity} gelöscht`;
      default:
        return functionName;
    }

  }
}
