import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const myProfilePages: SidebarPageGroup[] = [
  {
    title: 'Verwaltung',
    pages: [
      {
        title: 'Zugangsdaten bearbeiten',
        icon: 'key',
        url: '/my-profile/',
        matchFull: true
      },
    ]
  }
];

export const myProfileBreadcrumb: UiBreadcrumb[] = [
  {
    title: 'Home',
    routerLink: '/'
  }, {
    title: 'Profil',
    routerLink: '/my-profile'
  }
];
