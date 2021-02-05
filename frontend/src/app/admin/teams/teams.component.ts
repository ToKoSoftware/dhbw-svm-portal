import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {adminBreadcrumb, adminPages} from "../admin.pages";
import {UserData} from "../../interfaces/user.interface";
import {UiButtonGroup} from "../../ui/ui.interface";
import {AvailableFilter, FilterValue} from "../../ui/filter/filter.component";
import {ConfirmModalService} from "../../services/confirm-modal/confirm-modal.service";
import {LoadingModalService} from "../../services/loading-modal/loading-modal.service";
import {ModalService} from "../../services/modal/modal.service";
import {LoginService} from "../../services/login/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api/api.service";
import {TitleBarService} from "../../services/title-bar/title-bar.service";
import {TeamService} from '../../services/data/teams/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit {
  private routeSubscription: Subscription;
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
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
  }, {
    title: "Vorname",
    name: "firstName",
  }, {
    title: "Nachname",
    name: "lastName",
  }];

  constructor(
    private teams: TeamService,
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private login: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public readonly titleBar: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBar.buttons$.next([{
      icon: 'plus',
      title: 'Team'
    }]);
    this.loadData();
    this.routeSubscription = this.route.params.subscribe(params => {
      this.currentEditUserId = params['id'] || '';
    });
  }

  ngOnDestroy(): void {
    this.titleBar.buttons$.next([]);
    this.routeSubscription.unsubscribe();
  }

  private loadData(filter = {}): void {
    this.loading = true;
    this.api.get<UserData[]>(['/users', 1], filter).subscribe(
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
}
