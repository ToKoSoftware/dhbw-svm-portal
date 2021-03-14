import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderData } from 'src/app/interfaces/order.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { OrdersService } from 'src/app/services/data/orders/orders.service';
import { LoadingModalService } from 'src/app/services/loading-modal/loading-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { TitleBarService } from 'src/app/services/title-bar/title-bar.service';
import { adminPages } from '../admin.pages';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  public sidebarPages = adminPages;
  public orderData: OrderData[] | null = null;
  private routeSubscription: Subscription = new Subscription();

  constructor(
    public readonly orders: OrdersService,
    private readonly api: ApiService,
    private readonly titleBarService: TitleBarService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.loading.showLoading();
    this.api.get<OrderData[]>(`/orders`).subscribe(
        data => {
          this.orderData = data.data;
          this.loading.hideLoading();
        },
        error => {
          this.notification.loadingFailed();
          this.loading.hideLoading();
        }
      );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.titleBarService.buttons$.next([]);
  }
}
