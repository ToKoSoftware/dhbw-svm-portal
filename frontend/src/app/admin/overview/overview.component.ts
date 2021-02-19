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
import {ThemeService} from '../../services/theme/theme.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public editOrgForm: FormGroup;
  public themeForm: FormGroup;
  private currentOrgSubscription: Subscription = new Subscription();
  private currentConfigSubscription: Subscription = new Subscription();
  private colorsSubscription: Subscription = new Subscription();
  private themeChanged = false;

  constructor(
    public readonly organizations: OrganizationsService,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
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
    this.currentConfigSubscription = this.currentOrg.currentConfig$.subscribe(
      config => {
        if (config) {
          this.loading.hideLoading();
          this.themeForm = this.formBuilder.group(
            {
              title_bar_background_color: [config.colors.titleBarBackgroundColor || ''],
              title_bar_border_color: [config.colors.titleBarBorderColor || ''],
              title_bar_text_color: [config.colors.titleBarTextColor || ''],
              sidebar_link_color: [config.colors.sidebarLinkTextColor || ''],
              accent_color: [config.colors.accentColor || ''],
            }
          );
          this.colorsSubscription = this.themeForm.valueChanges.subscribe((value) => {
            const colorFields: { [k: string]: keyof ColorConfig } = {
              title_bar_background_color: 'titleBarBackgroundColor',
              title_bar_border_color: 'titleBarBorderColor',
              title_bar_text_color: 'titleBarTextColor',
              sidebar_link_color: 'sidebarLinkTextColor',
              accent_color: 'accentColor',
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
              this.theme.updateTheme({...config})
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
    this.currentConfigSubscription.unsubscribe();
    this.colorsSubscription.unsubscribe();
    this.theme.resetTheme()
  }


}

