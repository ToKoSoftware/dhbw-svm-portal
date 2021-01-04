import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-titled-content',
  templateUrl: './titled-content.component.html',
})
export class TitledContentComponent {
  @Input() title: string = "";
  @Input() description: string = "";
}
