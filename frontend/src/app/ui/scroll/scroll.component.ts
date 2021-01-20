import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html'
})
export class ScrollComponent {
  @HostBinding('class') classes = 'w-full h-full  overflow-y-auto';
}
