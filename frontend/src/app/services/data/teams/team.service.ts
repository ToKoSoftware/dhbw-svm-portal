import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TeamData} from '../../../interfaces/team.interface';
import {RoleData} from '../../../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends DataService<TeamData> implements DataServiceFunctions<TeamData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<TeamData[]>('/teams')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(teamData: CreateAndUpdateData<TeamData>): Observable<TeamData> {
    return this.api.post<TeamData>(`/teams/`, teamData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<TeamData>): boolean {
    this.reloadData();
    return false;
  }

  read(id: string): Observable<TeamData> {
    return this.api.get<TeamData>(`/teams/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<TeamData>): Observable<TeamData> {
    return this.api.put<TeamData>(`/teams/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  assignUserToTeam(updateData: { role_id: string, user_id: string }) {
    return this.api.post<RoleData>(`/roles/${updateData.role_id}/assignment`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  removeUserFromTeam(updateData: { role_id: string, user_id: string }) {
    return this.api.post<RoleData>(`/roles/${updateData.role_id}/assignment`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }
}
