import {Component, OnInit, Input, Self, Optional} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';

@Component({
  selector: 'app-labeled-value',
  templateUrl: './labeled-value.component.html',
  styleUrls: ['./labeled-value.component.scss']
})
export class LabeledValueComponent {
  @Input() label: string;
  @Input() value: string | number;

}
