import { Component, OnInit } from '@angular/core';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-slide-over',
  templateUrl: './slide-over.component.html'
})
export class SlideOverComponent implements OnInit {

  constructor(public readonly slideOver: SlideOverService) { }

  ngOnInit(): void {
  }

  public close(): void {
    this.slideOver.close();
  }
}
