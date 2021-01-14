import {Component, Input, OnInit} from '@angular/core';
import {UiBreadcrumb, UiButtonGroup} from '../ui.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input() heading = '';
  @Input() whiteBg = false;
  @Input() large = false;
  @Input() buttons: UiButtonGroup | null = null;
  @Input() breadcrumbs: UiBreadcrumb[] | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
