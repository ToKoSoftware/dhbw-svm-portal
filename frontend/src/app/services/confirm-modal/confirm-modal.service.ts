import {Injectable, OnInit} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {ConfirmModalConfig} from '../../ui/modals/confirm-modal/confirm-modal.component';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  public clickEvent$: Subject<boolean> = new Subject();
  public showModal$: ReplaySubject<boolean> = new ReplaySubject();
  private confirmModalConfig: ConfirmModalConfig;

  public confirm(config: ConfirmModalConfig): Promise<boolean> {
    this.confirmModalConfig = config;
    this.showModal$.next(true);
    return this.clickEvent$.pipe(
      take(1),
    ).toPromise();
  }

  constructor() {
    this.showModal$.next(false);
  }

  get getConfig(): ConfirmModalConfig {
    return this.confirmModalConfig;
  }
}
