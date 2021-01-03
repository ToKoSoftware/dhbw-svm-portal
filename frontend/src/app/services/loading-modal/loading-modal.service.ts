import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingModalService {
  public showModal$: ReplaySubject<boolean> = new ReplaySubject();

  constructor() {
    this.showModal$.next(false);
  }

  public showLoading(): void {
    this.showModal$.next(true);
  }

  public hideLoading(): void {
    this.showModal$.next(false);
  }

}
