import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {adminPages} from '../admin.pages';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {DirectDebitMandateData} from '../../interfaces/direct-debit-mandate.interface';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-direct-debit-mandates',
  templateUrl: './direct-debit-mandates.component.html'
})
export class DirectDebitMandatesComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public mandates: DirectDebitMandateData[] | null = null;
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
    this.titleBarService.buttons$.next([{
      title: 'Vetragstexte bearbeiten',
      icon: 'edit',
      function: () => {
        this.slideOver.showSlideOver('', this.edit);
      }
    }]);
    this.loadData();
  }

  public loadData(): void {
    this.loading.showLoading();
    this.api.get<DirectDebitMandateData[]>('/direct-debit-mandates').subscribe(data => {
      this.mandates = data.data;
      this.loading.hideLoading();
    });
  }

  public cancelMandate(mandate: DirectDebitMandateData): void {
    this.loading.showLoading();
    this.api.delete([`/users/${mandate.user.id}/direct-debit-mandates`, 1]).subscribe(
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

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }
}
