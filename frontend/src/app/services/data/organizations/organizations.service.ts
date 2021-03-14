import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ColorConfig, OrganizationConfigurationData, OrganizationData} from '../../../interfaces/organization.interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends DataService<OrganizationData> implements DataServiceFunctions<OrganizationData> {

  reloadData() {
    this.data$.next(null);
    if (this.login.decodedJwt$.value?.is_admin) {
      this.api.get<OrganizationData[]>('/organizations')
        .subscribe(
          data => this.data$.next(data.data),
          error => this.notifications.loadingFailed()
        );
    }
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

  getByAccessCode(code: string) {
    return this.api.get<OrganizationData>(`/access/${code}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  getConfig(id: string): Observable<OrganizationConfigurationData> {
    return this.api.get<OrganizationConfigurationData>(`/organizations/${id}/config`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  updateConfig(updateData: { id: string; colors: { [k: string]: string } }): Observable<OrganizationConfigurationData> {
    return this.api.put<OrganizationConfigurationData>(`/organizations/${updateData.id}/config`, updateData.colors as any)
      .pipe(map(res => {
        this.reloadData();
        this.notifications.savedSuccessfully();
        return res.data;
      }));
  }


}
