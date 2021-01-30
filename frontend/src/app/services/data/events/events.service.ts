import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventData} from '../../../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends DataService<EventData> implements DataServiceFunctions<EventData> {

  reloadData() {
    this.api.get<EventData[]>('/events', {sort: 'date'}).subscribe(data => this.data$.next(data.data));
  }

  create(eventData: CreateAndUpdateData<EventData>): Observable<EventData> {
    this.reloadData();
    return this.api.post<EventData>(`/events`, eventData)
      .pipe(map(res => {
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

  update(EventData: CreateAndUpdateData<EventData>): Observable<EventData> {
    this.reloadData();
    return this.api.put<EventData>(`/events/${EventData.id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

}
