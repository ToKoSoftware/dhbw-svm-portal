import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';

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
        title: 'Vereinsfarben',
        icon: 'layers',
        url: '/my-team/theme',
        matchFull: true
      },
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/my-team/stats',
        matchFull: true
      },
    ]
  }, {
    title: 'Personen & Sicherheit',
    pages: [
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
      {
        title: 'Datenschutz',
        icon: 'eye-off',
        url: '/my-team/privacy',
      },
      {
        title: 'Single-Sign-On',
        icon: 'log-in',
        url: '/my-team/oauth2',
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
        title: 'Dokumente',
        icon: 'folder',
        url: '/my-team/documents',
      },
      {
        title: 'Umfragen',
        icon: 'pie-chart',
        url: '/my-team/polls',
      },
      {
        title: 'Shop',
        icon: 'shopping-bag',
        url: '/my-team/shop',
      },
      {
        title: 'Inventar',
        icon: 'clipboard',
        url: '/my-team/inventory',
      },
      {
        title: 'Trainingspläne',
        icon: 'watch',
        url: '/my-team/training',
      },
      {
        title: 'Formulare',
        icon: 'file-text',
        url: '/my-team/forms',
      },
    ]
  }, {
    title: 'Erweitert',
    pages: [
      {
        title: 'Lastschriftmandate',
        icon: 'credit-card',
        url: '/my-team/direct-debit-mandates',
      },
      {
        title: 'Ereignisprotokoll',
        icon: 'list',
        url: '/my-team/event-log',
      },
    ]
  }
];
