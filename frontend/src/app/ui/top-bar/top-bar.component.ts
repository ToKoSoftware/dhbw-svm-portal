import {Component, OnInit} from '@angular/core';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {UiButton, UiButtonType} from '../ui.interface';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
  constructor(public readonly titleBar: TitleBarService) {
  }

  ngOnInit(): void {
  }

  /**
   * Handle button click
   * @param {UiButton} button
   */
  public handleButtonClick(button: UiButton): void {
    if (button.type === UiButtonType.disabled) {
      return;
    }
    if (button.function) {
      button?.function();
    }
  }
}
