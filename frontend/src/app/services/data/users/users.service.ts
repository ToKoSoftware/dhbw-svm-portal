import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserData} from '../../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DataService<UserData> implements DataServiceFunctions<UserData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<UserData[]>(['/users', 1], {sort: 'date'})
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(UserData: CreateAndUpdateData<UserData>): Observable<UserData> {
    this.reloadData();
    return this.api.post<UserData>(['/users', 1], UserData)
      .pipe(map(res => {
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<UserData>): boolean {
    return false;
  }

  read(id: string): Observable<UserData> {
    return this.api.get<UserData>([`/users/${id}`, 1])
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(UserData: CreateAndUpdateData<UserData>): Observable<UserData> {
    this.reloadData();
    return this.api.put<UserData>([`/users/${UserData.id}`, 1])
      .pipe(map(res => {
        return res.data;
      }));
  }

}
