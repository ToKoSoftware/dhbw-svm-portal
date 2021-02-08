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
    return this.api.post<RoleData>('/roles', RoleData)
      .pipe(map(res => {
        this.reloadData();
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

  update(updateData: CreateAndUpdateData<RoleData>): Observable<RoleData> {
    return this.api.put<RoleData>(`/roles/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  assignUserToRole(updateData: {role_id: string, user_id: string}) {
    return this.api.post<RoleData>(`/roles/${updateData.role_id}/assignment`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  removeRoleFromUser(updateData: {role_id: string, user_id: string}) {
    return this.api.delete<RoleData>(`/roles/${updateData.role_id}/assignment`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res;
      }));
  }

}
