import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Verwaltung',
    pages: [
      {
        title: 'Allgemein',
        icon: 'info',
        url: '/my-team/',
        matchFull: true
      },
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/my-team/stats',
        matchFull: true
      },
      {
        title: 'Event-Einstellungen',
        icon: 'calendar',
        url: '/my-team/events',
      },
      {
        title: 'Benutzer',
        icon: 'user',
        url: '/my-team/users',
      },
      {
        title: 'Teams',
        icon: 'users',
        url: '/my-team/teams',
      },
      {
        title: 'Rollen',
        icon: 'lock',
        url: '/my-team/roles',
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
