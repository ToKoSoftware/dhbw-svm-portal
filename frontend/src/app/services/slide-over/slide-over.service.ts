import {Injectable, OnDestroy, TemplateRef} from '@angular/core';
import {BehaviorSubject, fromEvent, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SlideOverService implements OnDestroy {
  public title: string;
  public modalContentElementRef: TemplateRef<any>;
  public showSlideOver$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private escPressSubscription: Subscription | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router) {
    this.showSlideOver$.next(true);
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

  public showSlideOver(title: string, elementRefName: TemplateRef<unknown>): void {
    this.title = title;
    this.showSlideOver$.next(true);
    this.modalContentElementRef = elementRefName;
  }

  public open(): void {
    this.showSlideOver$.next(true);
  }

  public close(): void {
    this.showSlideOver$.next(false);
  }
}
