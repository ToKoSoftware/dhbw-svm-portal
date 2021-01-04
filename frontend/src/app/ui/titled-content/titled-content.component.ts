import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-titled-content',
  templateUrl: './titled-content.component.html',
})
export class TitledContentComponent {
  @Input() label: string = "";
  @Input() description: string = "";
}
