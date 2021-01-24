import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {AvailableFilter, FilterValue} from '../../ui/filter/filter.component';
import {LoginService} from '../../services/login/login.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  @ViewChild('relatedCustomersModal', {static: true}) relatedCustomersModal: TemplateRef<unknown>;
  public results: UserData[] = [];
  public loading = false;
  public currentEditUserId: string = '';
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Benutzerdaten exportieren',
        function: () => {
          const jwt = this.login.jwt$.value;
          window.location.assign(`/api/v1/admin/export/users?token=${jwt}`);
        },
        icon: 'download-cloud'
      }
    ]
  };
  public filters: AvailableFilter[] = [{
    title: "E-Mail",
    name: "email",
  },{
    title: "Vorname",
    name: "first_name",
  },{
    title: "Nachname",
    name: "last_name",
  }];

  constructor(
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private login: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.routeSubscription = this.route.params.subscribe(params => {
      this.currentEditUserId = params['id'] || '';
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private loadData(filter = {}): void {
    this.loading = true;
    this.api.get<UserData[]>('/users', filter).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public applyFilter(filterValue: FilterValue[]): void {
    let f: { [k: string]: string } = {};
    filterValue.forEach(val => {
      f[val.name] = val.value;
    })
    this.loadData(f);
  }

  public async showDeleteModalForUser(user: UserData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie den User mit der E-Mail "${user.email}" entfernen möchten?`,
      description: 'Dies kann nicht rückgängig gemacht werden.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.delete<{ success: boolean } | { success: boolean, error: string }>(`/users/${user.id}`).subscribe(
        data => {
          this.loadData();
          this.loadingService.hideLoading();
        },
        error => {
          this.loadingService.hideLoading();
          this.confirmService.confirm({
            title: `Es ist ein Fehler beim Löschen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
    }
  }
}