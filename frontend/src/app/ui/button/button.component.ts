import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() route: string | null = null;
  @Input() icon: string | null = null;
  @Input() type: ButtonType = 'info';
  @Input() formButtonType: 'button' | 'submit' = 'button';
  @Input() size: ButtonSize = 'small';

  @HostListener("click") onClick(){
    if (this.route != null) {
      this.router.navigate([this.route]);
    }
  }

  constructor(private readonly router: Router) {
  }
}

export type ButtonType = 'blank' | 'info' | 'danger' | 'transparent'  | 'link' | 'link-danger';
export type ButtonSize = 'normal' | 'small' | 'full';
