import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-secondary-navigation',
  templateUrl: './secondary-navigation.component.html'
})
export class SecondaryNavigationComponent {
  @HostBinding('class') classes = 'md:h-full';
  @Input() size: 'small' | 'large' = 'small';
}
