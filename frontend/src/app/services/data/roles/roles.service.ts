import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RoleData} from '../../../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends DataService<RoleData> implements DataServiceFunctions<RoleData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<RoleData[]>('/roles', {sort: 'date'})
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(RoleData: CreateAndUpdateData<RoleData>): Observable<RoleData> {
    this.reloadData();
    return this.api.post<RoleData>('/roles', RoleData)
      .pipe(map(res => {
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<RoleData>): boolean {
    return false;
  }

  read(id: string): Observable<RoleData> {
    return this.api.get<RoleData>(`/roles/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(RoleData: CreateAndUpdateData<RoleData>): Observable<RoleData> {
    this.reloadData();
    return this.api.put<RoleData>(`/users/${RoleData.id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

}
