import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';

export const teamPages: SidebarPageGroup[] = [
  {
    title: 'Meine Teams',
    pages: [
      {
        title: 'Verwalten',
        icon: 'info',
        url: '/teams/',
        matchFull: true
      },
    ]
  },
  {
    title: 'Inhalte',
    pages: [
      {
        title: 'Veranstaltungen',
        icon: 'calendar',
        url: '/teams/events',
        matchFull: true
      },
      {
        title: 'Umfragen',
        icon: 'pie-chart',
        url: '/teams/polls',
        matchFull: true
      },
    ]
  }
];
