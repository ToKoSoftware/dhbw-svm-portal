import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent implements OnInit {
  @HostBinding('class') classes = 'w-full';
  @Input() public large = false;
  @Input() public center = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
