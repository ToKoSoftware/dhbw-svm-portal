import {Component, OnInit} from '@angular/core';
import {myProfileBreadcrumb, myProfilePages} from "../my-profile.pages";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
}
