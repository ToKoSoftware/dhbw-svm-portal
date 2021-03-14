import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ItemData } from 'src/app/interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends DataService<ItemData> implements DataServiceFunctions<ItemData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<ItemData[]>('/items')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(ItemData: CreateAndUpdateData<ItemData>): Observable<ItemData> {
    return this.api.post<ItemData>(`/items`, ItemData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: ItemData): Observable<unknown> {
    return this.api.delete<ItemData>(`/items/${data.id}`)
      .pipe(map(res => {
        this.reloadData();
        return res;
      }));
  }

  read(id: string): Observable<ItemData> {
    return this.api.get<ItemData>(`/items/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<ItemData>): Observable<ItemData> {
    return this.api.put<ItemData>(`/items/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

}
