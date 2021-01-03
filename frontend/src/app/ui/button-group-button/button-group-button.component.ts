import {Component, Input, OnInit} from '@angular/core';
import {UiButton, UiButtonType} from '../ui.interface';

@Component({
  selector: 'app-button-group-button',
  templateUrl: './button-group-button.component.html',
  styleUrls: ['./button-group-button.component.scss']
})
export class ButtonGroupButtonComponent implements OnInit {
  @Input('button') button: UiButton;
  @Input('buttonPosition') buttonPosition: number;
  @Input('length') length: number;
  public classes = '';

  constructor() {
  }

  ngOnInit(): void {
    this.classes = this.calculateClass();
  }


  public calculateClass(): string {
    const classList = [
      'relative inline-flex items-center px-4 py-2 ' +
      'border border-gray-300 bg-white text-sm leading-5 ' +
      'text-gray-700 transition ease-in-out duration-150'
    ];

    if (this.button.type === undefined) {
      classList.push(
        'hover:text-gray-500 focus:z-10 ' +
        'focus:outline-none focus:border-blue-300 ' +
        'focus:shadow-outline-blue active:bg-gray-100 ' +
        'active:text-gray-700'
      );
    }
    if (this.buttonPosition === 0) {
      classList.push('rounded-l-md');
    }
    if (this.buttonPosition + 1 === this.length) {
      classList.push('rounded-r-md');
    }
    if (this.button.type === undefined) {
      classList.push('font-medium');
    }
    if (this.button.type === UiButtonType.noAction) {
      classList.push('font-bold');
    }
    return classList.join(' ');
  }


  public handleButtonClick(button: UiButton): void {
    if (button.type === UiButtonType.disabled) {
      return;
    }
    if (button.function) {
      button?.function();
    }
  }

}
