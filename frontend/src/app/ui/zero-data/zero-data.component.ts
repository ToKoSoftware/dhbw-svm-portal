import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-zero-data',
  templateUrl: './zero-data.component.html'
})
export class ZeroDataComponent implements OnInit {
  @Input() image: AvailableZeroDataImages = 'empty';
  @Input() heading = 'Keine Daten vorhanden';
  @Input() description = '';
  constructor() { }

  ngOnInit(): void {
  }

}
export type AvailableZeroDataImages = 'empty';
