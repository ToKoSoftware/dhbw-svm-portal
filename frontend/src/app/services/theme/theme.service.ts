import { Injectable } from '@angular/core';
import {ColorConfig, OrganizationConfigurationData} from '../../interfaces/organization.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme: OrganizationConfigurationData;
  private cssNameMapping: {[k in keyof ColorConfig]: string} = {
    titleBarBackgroundColor: '--title-bar-background-color',
    titleBarBorderColor: '--title-bar-border-color',
    titleBarTextColor: '--title-bar-text-color',
    sidebarLinkTextColor: '--sidebar-text-color',
    accentColor: '--accent-color',
  };

  set theme(value: OrganizationConfigurationData) {
    this._theme = {...value};
  }

  public resetTheme(): void {
    this.updateTheme(this._theme);
  }

  public updateTheme(config: OrganizationConfigurationData): void {
    if (!config.colors) {
      config.colors = {};
    }
    Object.keys(config.colors).forEach((key: keyof ColorConfig) => {
      document.documentElement.style
        .setProperty(this.cssNameMapping[key] || '', config.colors[key] || null);
    });
  }
}
