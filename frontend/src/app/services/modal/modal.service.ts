import {ElementRef, Injectable, OnDestroy, TemplateRef} from '@angular/core';
import {fromEvent, ReplaySubject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  public title: string;
  public modalContentElementRef: TemplateRef<any>;
  public showModal$: ReplaySubject<boolean> = new ReplaySubject();
  private escPressSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router) {
    this.showModal$.next(true);
    this.routerSubscription = this.router.events.subscribe(val => {
      this.close();
    });
    this.escPressSubscription = fromEvent(document.body, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Escape' || event.key === 'Esc'),
    ).subscribe((event) => {
      event.preventDefault();
      this.close();
    });
  }

  public ngOnDestroy(): void {
    this.close();
    this.routerSubscription?.unsubscribe();
    this.escPressSubscription?.unsubscribe();
  }

  public showModal(title: string, elementRefName: TemplateRef<unknown>): void {
    this.title = title;
    this.showModal$.next(true);
    this.modalContentElementRef = elementRefName;
  }

  public open(): void {
    this.showModal$.next(true);
  }

  public close(): void {
    this.showModal$.next(false);
  }
}
