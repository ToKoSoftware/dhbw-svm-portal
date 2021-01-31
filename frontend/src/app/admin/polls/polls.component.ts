import { Component, OnInit } from '@angular/core';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html'
})
export class PollsComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor() { }

  ngOnInit(): void {
  }

}
