import { Component, OnInit } from '@angular/core';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor() { }

  ngOnInit(): void {
  }

}
