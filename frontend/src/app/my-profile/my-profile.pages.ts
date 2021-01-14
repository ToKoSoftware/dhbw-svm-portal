import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const myProfilePages: SidebarPageGroup[] = [
  {
    title: 'Ihr Profil',
    pages: [
      {
        title: 'Profil bearbeiten',
        icon: 'user',
        url: '/my-profile/',
        matchFull: true
      },
      {
        title: 'Zugangsdaten bearbeiten',
        icon: 'key',
        url: '/my-profile/credentials',
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
