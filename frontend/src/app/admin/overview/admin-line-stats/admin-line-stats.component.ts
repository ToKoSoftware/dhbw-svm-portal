import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ApiService} from '../../../services/api/api.service';

@Component({
  selector: 'app-order-stats',
  templateUrl: './admin-line-stats.component.html',
  styleUrls: ['./admin-line-stats.component.scss']
})
export class AdminLineStatsComponent implements OnInit {
  @Input() private chartFor: keyof StatsResponse = 'plans';
  @Input() private statData: StatsResponse;
  lineChartData: ChartDataSets[] = [
    {data: [], label: ''},
  ];

  private labels = {
    'customers': 'Neue Kunden / Monat',
    'users': 'Neue Benutzer / Monat',
    'plans': 'Neue Tarife / Monat',
    'orders': 'Neue Bestellungen / Monat',
  };

  public lineChartLabels: Label[] = [];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartColors: Color[] = [
    {
      borderColor: '#faca15',
      backgroundColor: 'transparent',
    },
  ];

  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartType = 'line';

  constructor(private api: ApiService) {
    // + 1 because js returns months index-off-by-one (0-11, not 1-12)
    this.lineChartLabels = AdminLineStatsComponent.getLast12Months().map(date => `${date.getMonth() + 1}-${date.getFullYear()}`);
  }

  ngOnInit(): void {
    const datesAreOnSameDay = (first: Date, second: Date) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();

    this.lineChartData[0].label = this.labels[this.chartFor];

    // map into correct month, else initialize with 0
    this.lineChartData[0].data = AdminLineStatsComponent.getLast12Months().map(month => {
      let foundIndex = this.statData[this.chartFor].findIndex(el => {
        return datesAreOnSameDay(new Date(el.date_trunc), month);
      });
      if (foundIndex === -1) {
        return 0;
      } else {
        return Number(this.statData[this.chartFor][foundIndex].count);
      }
    });

  }

  private static getLast12Months(): Date[] {
    const date = new Date();
    let last12MonthsArray = [];

    // get Dates of last 12 Months
    for (let i = 11; i >= 1; i--) {
      let d = new Date(date.getFullYear(), date.getMonth() - i, 1, 0, 0, 0, 0);
      last12MonthsArray.push(d);
    }
    const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    last12MonthsArray.push(firstDayOfCurrentMonth);

    return last12MonthsArray;
  }

}

export interface StatsResponse {
  customers: MonthlyStat[],
  users: MonthlyStat[],
  plans: MonthlyStat[],
  orders: MonthlyStat[],
}

export interface MonthlyStat {
  date_trunc: string,
  count: string
}

type statsCategory = keyof StatsResponse;
