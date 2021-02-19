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
import validateColor from 'validate-color';
import {ColorConfig} from '../../interfaces/organization.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public editOrgForm: FormGroup;
  private currentOrgSubscription: Subscription = new Subscription();
  private colorsSubscription: Subscription = new Subscription();

  constructor(
    public readonly organizations: OrganizationsService,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
    private readonly loading: LoadingModalService,
    private readonly titleBarService: TitleBarService,
    private readonly formBuilder: FormBuilder,
    public readonly slideOver: SlideOverService) {
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.editOrgForm = this.formBuilder.group(
      {
        title: [],
        access_code: [],
        privacy_policy_text: [],
        title_bar_background_color: [],
        title_bar_border_color: [],
        title_bar_text_color: [],
        sidebar_link_color: [],
      }
    );
    this.currentOrgSubscription = this.currentOrg.currentOrg$.subscribe(
      org => {
        if (org) {
          this.loading.hideLoading();
          this.editOrgForm = this.formBuilder.group(
            {
              title: [org.title],
              access_code: [org.access_code],
              privacy_policy_text: [org.privacy_policy_text],
              title_bar_background_color: [],
              title_bar_border_color: [],
              title_bar_text_color: [],
              sidebar_link_color: [],
            }
          );
          this.colorsSubscription = this.editOrgForm.valueChanges.subscribe((value) => {
            const colorFields: { [k: string]: keyof ColorConfig } = {
              title_bar_background_color: 'titleBarBackgroundColor',
              title_bar_border_color: 'titleBarBorderColor',
              title_bar_text_color: 'titleBarTextColor',
              sidebar_link_color: 'sidebarLinkTextColor',
            };
            Object.keys(colorFields).forEach(key => {
              const colorName = colorFields[key];
              let config = this.currentOrg.currentConfig$.value;
              if (!config) {
                config = {
                  colors: {}
                };
              } else {
                if (!Object.keys(config).includes('colors')) {
                  config.colors = {};
                }
              }
              if (validateColor(value[key])) {
                config.colors[colorName] = value[key];
              } else {
                delete config.colors[colorName];
              }
                console.log(config);
                this.currentOrg.currentConfig$.next(config);
            });
          });
        }
      }
    );
  }

  public save(): void {
    if (this.editOrgForm.dirty && !this.editOrgForm.valid) {
      return;
    }
    const data = {...this.editOrgForm.value, id: this.currentOrg.currentOrg$.getValue()?.id}
    this.organizations.update(data).subscribe(updatedOrg => this.currentOrg.currentOrg$.next(updatedOrg));
  }

  ngOnDestroy(): void {
    this.currentOrgSubscription.unsubscribe();
    this.colorsSubscription.unsubscribe();
  }


}

