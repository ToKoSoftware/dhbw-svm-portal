import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';
import {SidebarPageGroup} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @ViewChild('profileMenu') profileMenu: ElementRef<any>;
  public searchQuery = '';
  public sidebarPageGroups: SidebarPageGroup[] = [{
    title: 'Portal',
    pages: [{
      icon: 'activity',
      title: 'News',
      matchFull: true,
      url: '/'
    }, {
      icon: 'calendar',
      title: 'Events',
      url: '/events'
    }, {
      icon: 'user-check',
      title: 'Anmeldungen',
      url: '/join'
    }]
  }, {
    title: 'Mein Verein',
    pages: [ {
      icon: 'tool',
      title: 'Verwaltung',
      url: '/my-team'
    }]
  }]

  constructor(
    public login: LoginService,
    private router: Router) {
  }

  ngOnInit(): void {
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
