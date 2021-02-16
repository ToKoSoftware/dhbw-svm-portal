import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {DocumentData} from '../../interfaces/documents.interface';
import {LoginService} from '../../services/login/login.service';
import {Subscription} from 'rxjs';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {FileUploadService} from '../../services/file-upload/file-upload.service';
import {NotificationService} from '../../services/notification/notification.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  public documents: DocumentData[] | null = null;
  private jwtSubscription: Subscription = new Subscription();
  private adminSubscription: Subscription = new Subscription();
  private uploadEventSubscription: Subscription = new Subscription();
  private jwt: string = '';
  error: boolean = false;
  @ViewChild('upload', {static: true}) upload: TemplateRef<unknown>;

  constructor(
    private readonly api: ApiService,
    private readonly login: LoginService,
    private readonly titleBarService: TitleBarService,
    private readonly slideOver: SlideOverService,
    private readonly fileUploadService: FileUploadService,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly confirm: ConfirmModalService
  ) {
  }

  ngOnInit(): void {
    this.jwtSubscription = this.login.jwt$.subscribe(
      jwt => {
        if (jwt) {
          this.jwt = jwt;
        }
      }
    );
    this.uploadEventSubscription = this.fileUploadService.uploadEvent$.subscribe(
      () => this.loadData()
    );
    this.adminSubscription = this.login.isAdmin$.subscribe(
      isAdmin => {
        this.titleBarService.buttons$.next([]);
        if (isAdmin) {
          this.titleBarService.buttons$.next([{
            title: 'Datei hochladen',
            icon: 'upload-cloud',
            function: () => {
              this.slideOver.showSlideOver('Datei hochladen', this.upload);
            }
          }]);
        }
      }
    );
    this.loadData();
  }

  private loadData() {
    this.error = false;
    this.documents = null;
    this.api.get<DocumentData[]>('/documents').subscribe(
      documentData => this.documents = documentData.data,
      () => this.error = true
    );
  }

  ngOnDestroy(): void {
    this.titleBarService.buttons$.next([]);
    this.jwtSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
    this.uploadEventSubscription.unsubscribe();
  }

  public getDownloadUrl(document: DocumentData): string {
    return `/api/v2/documents/${document.name}?token=${this.jwt}`;
  }

  public async deleteDocument(document: DocumentData): Promise<void> {
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie die Datei ${document.name} löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm) {
      return;
    }
    this.loading.showLoading();
    this.api.delete(`/documents/${document.name}`).subscribe(
      () => {
        this.loadData();
        this.loading.hideLoading();
      },
      () => {
        this.notifications.savingFailed();
        this.loading.hideLoading();
      }
    );
  }

}
