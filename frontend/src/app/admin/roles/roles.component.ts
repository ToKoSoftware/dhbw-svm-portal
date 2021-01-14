import {Component, OnDestroy, OnInit} from '@angular/core';
import {adminBreadcrumb, adminPages} from "../admin.pages";
import {TitleBarService} from "../../services/title-bar/title-bar.service";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public loading = false;

  constructor(public readonly titleBar: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBar.buttons$.next([{
      icon: 'plus',
      title: 'Rolle'
    }]);
  }

  ngOnDestroy(): void {
    this.titleBar.buttons$.next([]);
  }

}
