import { Component, OnInit } from '@angular/core';
import {TitleBarService} from "../../services/title-bar/title-bar.service";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {

  constructor(public readonly titleBar: TitleBarService) { }

  ngOnInit(): void {
  }

}
