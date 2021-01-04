import {Component, OnInit} from '@angular/core';
import {adminBreadcrumb, adminPages} from "../admin.pages";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public loading = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
