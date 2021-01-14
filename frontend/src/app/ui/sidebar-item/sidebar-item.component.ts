import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SidebarPage} from '../sidebar/sidebar.component';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html'
})
export class SidebarItemComponent implements OnInit, OnDestroy {
  @Input() item: SidebarPage;
  public currentRoute: string;
  private routeSubscription: Subscription;

  constructor(private router: Router) {
    this.routeSubscription = router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.currentRoute = val.url;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
