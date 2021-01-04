import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Systemverwaltung',
    pages: [
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/my-team/',
        matchFull: true
      },
      {
        title: 'System-Benutzer',
        icon: 'mouse-pointer',
        url: '/my-team/users',
      },
    ]
  },
  {
    title: 'Weitere Funktionen',
    pages: [
      {
        title: 'Profil bearbeiten',
        icon: 'user',
        url: '/my-profile/',
        matchFull: true
      },
    ]
  }
];

export const adminBreadcrumb: UiBreadcrumb[] = [
  {
    title: 'Home',
    routerLink: '/'
  }, {
    title: 'my-team',
    routerLink: '/my-team'
  }
];
