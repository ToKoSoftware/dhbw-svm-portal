import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {OrganizationData} from '../../../interfaces/organization.interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends DataService<OrganizationData> implements DataServiceFunctions<OrganizationData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<OrganizationData[]>('/organizations')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(OrganizationData: CreateAndUpdateData<OrganizationData>): Observable<OrganizationData> {
    return this.api.post<OrganizationData>('/organizations', OrganizationData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<OrganizationData>): boolean {
    return false;
  }

  read(id: string): Observable<OrganizationData> {
    return this.api.get<OrganizationData>(`/organizations/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<OrganizationData>): Observable<OrganizationData> {
    return this.api.put<OrganizationData>(`/organizations/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        this.notifications.savedSuccessfully();
        return res.data;
      }));
  }

}
