import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  public window = window;
  constructor() { }

  ngOnInit(): void {
  }

}
