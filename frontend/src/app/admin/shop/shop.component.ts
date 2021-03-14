import { Component, OnInit } from '@angular/core';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  public sidebarPages = adminPages;

  constructor() { }

  ngOnInit(): void {
  }

}
