import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OrderData } from "src/app/interfaces/order.interface";
import { DataService, DataServiceFunctions, CreateAndUpdateData } from "../data.service";

@Injectable({
    providedIn: 'root'
  })
export class OrdersService extends DataService<OrderData> implements DataServiceFunctions<OrderData> {

reloadData() {
    this.data$.next(null);
    this.api.get<OrderData[]>('/orders')
    .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
    );
}

create(OrderData: CreateAndUpdateData<OrderData>): Observable<OrderData> {
    return this.api.post<OrderData>(`/orders`, OrderData)
    .pipe(map(res => {
        this.reloadData();
        return res.data;
    }));
}

delete(data: OrderData): Observable<unknown> {
    return this.api.delete<OrderData>(`/orders/${data.id}`)
    .pipe(map(res => {
        this.reloadData();
        return res;
    }));
}

read(id: string): Observable<OrderData> {
    return this.api.get<OrderData>(`/orders/${id}`)
    .pipe(map(res => {
        return res.data;
    }));
}

update(updateData: CreateAndUpdateData<OrderData>): Observable<OrderData> {
    return this.api.put<OrderData>(`/orders/${updateData.id}`, updateData)
    .pipe(map(res => {
        this.reloadData();
        return res.data;
    }));
}

}