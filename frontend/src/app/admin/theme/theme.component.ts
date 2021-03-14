import {Component, OnDestroy, OnInit} from '@angular/core';
import {adminPages} from '../admin.pages';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ColorConfig} from '../../interfaces/organization.interface';
import {OrganizationsService} from '../../services/data/organizations/organizations.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {ThemeService} from '../../services/theme/theme.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import validateColor from 'validate-color';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html'
})
export class ThemeComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public themeForm: FormGroup;
  private currentConfigSubscription: Subscription = new Subscription();
  private colorsSubscription: Subscription = new Subscription();
  private  colorFields: { [k: string]: keyof ColorConfig } = {
    title_bar_background_color: 'titleBarBackgroundColor',
    title_bar_border_color: 'titleBarBorderColor',
    title_bar_text_color: 'titleBarTextColor',
    sidebar_link_color: 'sidebarLinkTextColor',
    accent_color: 'accentColor',
  };

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
    this.themeForm = this.formBuilder.group(
      {
        title_bar_background_color: [],
        title_bar_border_color: [],
        title_bar_text_color: [],
        sidebar_link_color: [],
        accent_color: [],
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
            Object.keys(this.colorFields).forEach(key => {
              const colorName = this.colorFields[key];
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

  public saveColors(): void {
    this.loading.showLoading();
    const colors: { [k: string]: string } = {};
    Object.keys(this.colorFields).forEach(key => {
      const colorName = this.colorFields[key];
      colors[colorName] = this.themeForm.value[key] === ""? undefined: this.themeForm.value[key];
    });
    const data = {id: this.currentOrg.currentOrg$.getValue()?.id || '', colors: colors}
    this.organizations.updateConfig(data).subscribe(
      () => this.loading.hideLoading()
    );
  }

  ngOnDestroy(): void {
    this.currentConfigSubscription.unsubscribe();
    this.colorsSubscription.unsubscribe();
    this.theme.resetTheme()
  }


}
