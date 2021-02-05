import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Mein Verein',
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
  }, {
    title: 'Inhalte',
    pages: [
      {
        title: 'News',
        icon: 'activity',
        url: '/my-team/news',
      },
      {
        title: 'Veranstaltungen',
        icon: 'calendar',
        url: '/my-team/events',
      },
      {
        title: 'Umfragen',
        icon: 'pie-chart',
        url: '/my-team/polls',
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
