import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent {
  @Input() progress = 100;

  public roundToPercent(number: number): string {
    return Math.round((number + Number.EPSILON) * 100) / 100 + '%';
  }
}
