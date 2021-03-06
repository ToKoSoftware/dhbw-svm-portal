import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {adminPages} from '../admin.pages';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {AvailableFilter, FilterValue} from '../../ui/filter/filter.component';
import {LoginService} from '../../services/login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UsersService} from '../../services/data/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  public sidebarPages = adminPages;
  public loading = false;
  public currentEditUserId: string = '';
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
    public users: UsersService,
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private login: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.currentEditUserId = params['id'] || '';
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public applyFilter(filterValue: FilterValue[]): void {
    this.confirmService.confirm({
      confirmButtonType: 'info',
      title: 'Diese Funktion ist noch nicht implementiert',
      description: '',
      confirmText: 'Ok',
      showCancelButton: false
    })
    let f: { [k: string]: string } = {};
    filterValue.forEach(val => {
      f[val.name] = val.value;
    })
    // todo reload data with filters
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
          this.users.reloadData();
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
