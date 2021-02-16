import {Component, ElementRef, HostBinding, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';
import {SidebarPageGroup} from '../sidebar/sidebar.component';
import {CurrentOrgService} from '../../services/current-org/current-org.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @HostBinding('class') classes = 'h-full flex flex-col';
  @ViewChild('profileMenu') profileMenu: ElementRef<any>;
  public searchQuery = '';
  public sidebarPageGroups: SidebarPageGroup[] = [];

  constructor(
    public readonly login: LoginService,
    private readonly currentOrg: CurrentOrgService,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.login.isAdmin$.subscribe(isAdmin => {
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
    });
  }

  public toggleUserMenu(): void {
    if (this.profileMenu.nativeElement.classList.contains('opacity-0')) {
      this.profileMenu.nativeElement.classList.remove(['hidden']);
      this.profileMenu.nativeElement.classList.remove(['opacity-0']);
      this.profileMenu.nativeElement.classList.remove('scale-95');
      this.profileMenu.nativeElement.classList.add('opacity-100');
      this.profileMenu.nativeElement.classList.add('scale-100');
    } else {
      this.profileMenu.nativeElement.classList.remove('opacity-100');
      this.profileMenu.nativeElement.classList.remove('scale-100');
      this.profileMenu.nativeElement.classList.add('opacity-0');
      this.profileMenu.nativeElement.classList.add('scale-95');
      this.profileMenu.nativeElement.classList.add(['hidden']);
    }
  }

  public search(): void {
    this.router.navigate(['/plans', this.searchQuery]);
  }
}
