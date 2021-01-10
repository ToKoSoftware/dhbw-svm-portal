import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-labeled-value',
  templateUrl: './labeled-value.component.html',
})
export class LabeledValueComponent {
  @Input() label: string;
  @Input() value: string | number;

}
