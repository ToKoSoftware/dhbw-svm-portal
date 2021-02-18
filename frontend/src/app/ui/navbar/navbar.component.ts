import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from '../../services/login/login.service';
import {SidebarPageGroup} from '../sidebar/sidebar.component';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'h-full flex flex-col';
  public sidebarPageGroups: SidebarPageGroup[] = [];
  private currentOrgSubscription: Subscription = new Subscription();
  private isAdminSubscription: Subscription = new Subscription();

  constructor(
    public readonly login: LoginService,
    public readonly currentOrg: CurrentOrgService) {
  }

  ngOnInit(): void {
    this.isAdminSubscription = this.login.isAdmin$.subscribe(isAdmin => {
      this.currentOrgSubscription = this.currentOrg.currentMaintainTeams$.subscribe(
        teams => {
          this.sidebarPageGroups = [{
            title: 'Portal',
            pages: [{
              icon: 'activity',
              title: 'News',
              matchFull: true,
              url: '/'
            }, {
              icon: 'calendar',
              title: 'Veranstaltungen',
              url: '/events'
            }, {
              icon: 'user-check',
              title: 'Meine Anmeldungen',
              url: '/join'
            }, {
              icon: 'folder',
              title: 'Dokumente',
              url: '/documents'
            }, {
              icon: 'pie-chart',
              title: 'Umfragen',
              url: '/polls'
            }]
          }];
          if (teams?.length) {
            this.sidebarPageGroups.push({
              title: 'Meine Teams',
              pages: [{
                icon: 'users',
                title: 'Teams Verwalten',
                url: '/teams'
              }]
            });
          }
          if (isAdmin) {
            this.sidebarPageGroups.push({
              title: 'Mein Verein',
              pages: [{
                icon: 'tool',
                title: 'Verwaltung',
                url: '/my-team'
              }]
            });
          }
        }
      );

    });
  }

  ngOnDestroy(): void {
    this.isAdminSubscription.unsubscribe();
    this.currentOrgSubscription.unsubscribe();
  }


}
