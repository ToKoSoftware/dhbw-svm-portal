import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventRegistrationData} from '../../../interfaces/event-registration.interface';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService extends DataService<EventRegistrationData> implements DataServiceFunctions<EventRegistrationData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<EventRegistrationData[]>('/events')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(EventRegistrationData: CreateAndUpdateData<EventRegistrationData>): Observable<EventRegistrationData> {
    return this.api.post<EventRegistrationData>(`/events`, EventRegistrationData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<EventRegistrationData>): boolean {
    return false;
  }

  read(id: string): Observable<EventRegistrationData> {
    return this.api.get<EventRegistrationData>(`/events/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(EventRegistrationData: CreateAndUpdateData<EventRegistrationData>): Observable<EventRegistrationData> {
    this.reloadData();
    return this.api.put<EventRegistrationData>(`/events/${EventRegistrationData.id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

}
