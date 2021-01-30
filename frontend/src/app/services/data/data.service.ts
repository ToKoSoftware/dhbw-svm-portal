import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService<Single> {
  public data: BehaviorSubject<Single[] | null> = new BehaviorSubject(null);

  constructor(@Inject(ApiService) public api: ApiService) {
    this.reloadData();
  }

  reloadData(): void {
    return;
  }

}

export interface DataServiceFunctions<Single> {
  reloadData: () => void;
  create: (data: CreateAndUpdateData<Single>) => Observable<Single>;
  read: (id: string) => Observable<Single>;
  update: (data: CreateAndUpdateData<Single>) => Observable<Single>;
  delete: (data: CreateAndUpdateData<Single>) => boolean;
}

export type CreateAndUpdateData<Type> = { [d in keyof Type]: string | number | null }
