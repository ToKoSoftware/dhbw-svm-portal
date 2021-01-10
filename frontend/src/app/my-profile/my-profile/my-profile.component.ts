import {Component, OnInit} from '@angular/core';
import {myProfileBreadcrumb, myProfilePages} from "../my-profile.pages";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
}
