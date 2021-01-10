import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() pageGroups: SidebarPageGroup[];

  constructor() { }

  ngOnInit(): void {
  }

}

export interface SidebarPage {
  title: string;
  url: string;
  icon: string;
  matchFull?: boolean;
}

export interface SidebarPageGroup {
  title: string;
  pages: SidebarPage[];
}

