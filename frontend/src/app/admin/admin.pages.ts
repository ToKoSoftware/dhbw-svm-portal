import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';
import {UiBreadcrumb} from '../ui/ui.interface';

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Systemverwaltung',
    pages: [
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/admin/',
        matchFull: true
      },
      {
        title: 'System-Benutzer',
        icon: 'mouse-pointer',
        url: '/admin/users',
      },
      {
        title: 'Kunden',
        icon: 'users',
        url: '/admin/customers',
      },
      {
        title: 'Tarife',
        icon: 'map',
        url: '/admin/plans',
      },
      {
        title: 'Bestellungen',
        icon: 'shopping-cart',
        url: '/admin/orders',
      }
    ]
  },
  {
    title: 'Weitere Funktionen',
    pages: [
      {
        title: 'Profil bearbeiten',
        icon: 'user',
        url: '/profile/',
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
    title: 'Admin',
    routerLink: '/admin'
  }
];
