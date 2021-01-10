import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent implements OnInit {
  @Input() public large = false;
  @Input() public center = false;
  constructor() { }

  ngOnInit(): void {
  }

}
