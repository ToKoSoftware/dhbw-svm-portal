import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {loadStyleSheets} from '../../functions/style-loader-async.func';
import {EventsService} from '../../services/data/events/events.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventData} from '../../interfaces/event.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  public availableViews: [string | number, string | number][] = [['month', 'Monat'], ['week', 'Woche'], ['day', 'Tag']];

  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public events$: Observable<CalendarEvent[]> = of([{
    title: 'dsd',
    start: new Date()
  }]);

  constructor(
    private readonly eventsService: EventsService,
    private readonly loading: LoadingModalService
  ) {
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.events$ = this.eventsService.data$.pipe(
      map((events: EventData[] | null) => {
          console.log(events);
          if (!events) {
            return [];
          }
          this.loading.hideLoading();
          return events.map(e => {
            const start = new Date(e.start_date);
            const end = new Date(e.end_date);
            const allDay = !(
              start.getFullYear() === end.getFullYear() &&
              start.getMonth() === end.getMonth() &&
              start.getDate() === end.getDate()
            );
            console.log(allDay, start, end)
            return {
              title: e.title,
              start,
              end,
              allDay,
              color: {
                primary: this.getRandomColor(),
                secondary: this.getRandomColor()
              }
            };
          });
        }
      ));
  }

  async ngAfterViewInit() {
    // Import calendar styles
    await loadStyleSheets([
      {
        // @ts-ignore
        stylePath: import('angular-calendar/css/angular-calendar.css'),
        elementName: 'calendar-style',
      },
    ]);
  }

  public changeView(value: string): void {
    switch (value) {
      case 'day':
        this.view = CalendarView.Day;
        break;
      case 'week':
        this.view = CalendarView.Week;
        break;
      case 'month':
        this.view = CalendarView.Month;
        break;
    }
  }

  eventClicked({event}: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  public isOnSameDay(isoDate1: string, isoDate2: string): boolean {
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);
    return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  }

  private getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
