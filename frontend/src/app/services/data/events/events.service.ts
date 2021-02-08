import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventData} from '../../../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends DataService<EventData> implements DataServiceFunctions<EventData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<EventData[]>('/events')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(eventData: CreateAndUpdateData<EventData>): Observable<EventData> {
    return this.api.post<EventData>(`/events`, eventData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<EventData>): boolean {
    return false;
  }

  read(id: string): Observable<EventData> {
    return this.api.get<EventData>(`/events/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<EventData>): Observable<EventData> {
    return this.api.put<EventData>(`/events/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

}
