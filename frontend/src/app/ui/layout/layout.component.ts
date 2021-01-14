import {Component, Input, OnInit} from '@angular/core';
import {UiBreadcrumb, UiButtonGroup} from '../ui.interface';
import {SidebarPageGroup} from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  @Input() sidebarPages: SidebarPageGroup[] = [];
  @Input() heading = 'Title';
  @Input() buttons: UiButtonGroup | null = null;
  @Input() breadcrumbs: UiBreadcrumb[] | null = [
    {routerLink: '/', title: 'Home'},
    {routerLink: '/', title: 'Seite 2'},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
