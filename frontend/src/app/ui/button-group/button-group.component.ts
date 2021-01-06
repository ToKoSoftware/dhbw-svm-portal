import {Component, Input, OnInit} from '@angular/core';
import {UiButtonGroup} from '../ui.interface';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html'
})
export class ButtonGroupComponent implements OnInit {
  @Input('buttons') buttons: UiButtonGroup | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
