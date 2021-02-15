import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {DocumentData} from '../../interfaces/documents.interface';
import {LoginService} from '../../services/login/login.service';
import {Subscription} from 'rxjs';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {FileUploadService} from '../../services/file-upload/file-upload.service';

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
  @ViewChild('upload', {static: true}) upload: TemplateRef<unknown>;

  constructor(
    private readonly api: ApiService,
    private readonly login: LoginService,
    private readonly titleBarService: TitleBarService,
    private readonly slideOver: SlideOverService,
    private readonly fileUploadService: FileUploadService
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
    this.documents = null;
    this.api.get<DocumentData[]>('/documents').subscribe(
      documentData => this.documents = documentData.data
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

}
