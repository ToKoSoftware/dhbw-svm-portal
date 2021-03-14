import { Component, OnInit } from '@angular/core';
import { OrderData } from 'src/app/interfaces/order.interface';
import { OrdersService } from 'src/app/services/data/orders/orders.service';
import { adminPages } from '../admin.pages';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  public sidebarPages = adminPages;
  public current: string;

  constructor(
    public readonly orders: OrdersService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  public editSlide(order: OrderData) {
    
  }

}
