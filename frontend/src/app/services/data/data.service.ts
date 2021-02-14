import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ApiService} from '../api/api.service';
import {NotificationService} from '../notification/notification.service';
import {LoginService} from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class DataService<Single> implements OnDestroy{
  private loginSubscription: Subscription = new Subscription();
  public data$: BehaviorSubject<Single[] | null> = new BehaviorSubject(null);

  constructor(@Inject(ApiService) protected api: ApiService,
              @Inject(LoginService) protected login: LoginService,
              @Inject(NotificationService) protected readonly notifications: NotificationService) {
    this.reloadData();
    this.loginSubscription = this.login.decodedJwt$.subscribe(jwt => {
      if (jwt) {
        if (jwt.is_admin) {
          this.reloadData();
        }
        this.data$.next(null);
      } else {
        this.data$.next(null);
      }
    });
  }

  reloadData(): void {
    return;
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
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
