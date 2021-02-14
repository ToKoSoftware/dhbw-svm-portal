import {Component, OnDestroy, OnInit} from '@angular/core';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {UiButton, UiButtonType} from '../ui.interface';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit, OnDestroy {
  private titleBarButtonsSubscription: Subscription;
  public buttons$: BehaviorSubject<UiButton[]> = new BehaviorSubject([]);

  constructor(public readonly titleBar: TitleBarService) {
  }

  ngOnInit(): void {
    this.titleBarButtonsSubscription = this.titleBar.buttons$.subscribe(buttons => setTimeout(() => this.buttons$.next(buttons)));
  }

  /**
   * Handle button click
   * @param {UiButton} button
   */
  public handleButtonClick(button: UiButton): void {
    if (button.type === UiButtonType.disabled) {
      return;
    }
    if (button.function) {
      button?.function();
    }
  }

  ngOnDestroy() {
    this.titleBarButtonsSubscription.unsubscribe();
  }
}
