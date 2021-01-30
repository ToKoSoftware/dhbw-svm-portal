import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {TeamData} from '../../../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends DataService<TeamData> implements DataServiceFunctions<TeamData> {

  reloadData() {
    this.api.get<TeamData[]>(['/teams', 1]).subscribe(data => this.data.next(data.data));
  }

  create(teamData: CreateAndUpdateData<TeamData>): Observable<TeamData> {
    this.reloadData();
    return this.api.get<TeamData>(`/teams/${teamData.id}`)
      .pipe(map(res => {
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

  update(teamData: CreateAndUpdateData<TeamData>): Observable<TeamData> {
    this.reloadData();
    return this.api.put<TeamData>(`/teams/${teamData.id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }
}
