import { Component, OnInit } from '@angular/core';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html'
})
export class FormsComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor() { }

  ngOnInit(): void {
  }

}
