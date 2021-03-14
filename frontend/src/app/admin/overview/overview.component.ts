import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {adminPages} from '../admin.pages';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OrganizationsService} from '../../services/data/organizations/organizations.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {Subscription} from 'rxjs';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {ThemeService} from '../../services/theme/theme.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public editOrgForm: FormGroup;
  public themeForm: FormGroup;
  private currentOrgSubscription: Subscription = new Subscription();
  private colorsSubscription: Subscription = new Subscription();

  constructor(
    public readonly organizations: OrganizationsService,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly titleBarService: TitleBarService,
    private readonly formBuilder: FormBuilder,
    private readonly theme: ThemeService,
    public readonly slideOver: SlideOverService) {
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.editOrgForm = this.formBuilder.group(
      {
        title: [],
        access_code: [],
      }
    );
    this.themeForm = this.formBuilder.group(
      {
        title_bar_background_color: [],
        title_bar_border_color: [],
        title_bar_text_color: [],
        sidebar_link_color: [],
        accent_color: [],
      }
    );

    this.currentOrgSubscription = this.currentOrg.currentOrg$.subscribe(
      org => {
        if (org) {
          this.loading.hideLoading();
          this.editOrgForm = this.formBuilder.group(
            {
              title: [org.title || ''],
              access_code: [org.access_code || ''],
            }
          );
        }
      }
    );
  }

  public save(): void {
    this.loading.showLoading();
    if (this.editOrgForm.dirty && !this.editOrgForm.valid) {
      return;
    }
    const data = {...this.editOrgForm.value, id: this.currentOrg.currentOrg$.getValue()?.id}
    this.organizations.update(data).subscribe(
      updatedOrg => {
        this.currentOrg.currentOrg$.next(updatedOrg);
        this.loading.hideLoading();
      },
      error => {
        this.loading.hideLoading();
        this.notifications.loadingFailed(error.error.data.error)
      });
  }

  ngOnDestroy(): void {
    this.currentOrgSubscription.unsubscribe();
    this.colorsSubscription.unsubscribe();
    this.theme.resetTheme()
  }


}

