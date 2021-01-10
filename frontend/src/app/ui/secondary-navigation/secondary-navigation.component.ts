import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-secondary-navigation',
  templateUrl: './secondary-navigation.component.html',
  styleUrls: ['./secondary-navigation.component.scss']
})
export class SecondaryNavigationComponent {
  @Input() size: 'small' | 'large' = 'small';
}
