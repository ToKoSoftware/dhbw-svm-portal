import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Label} from 'ng2-charts';
import {ApiService} from '../../../services/api/api.service';

@Component({
  selector: 'app-admin-referrer-stats',
  templateUrl: './admin-referrer-stats.component.html',
  styleUrls: ['./admin-referrer-stats.component.scss']
})
export class AdminReferrerStatsComponent implements OnInit {
  @Input() private statData: StatsResponse;
  lineChartData: ChartDataSets[] = [];
  public loading = true;
  public lineChartLabels: Label[] = [];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartColors: string[] = [
    'rgba(250, 202, 21, 0.9)',
    'rgba(0,0,0,0.9)',
    'rgba(120,120,120,0.9)',
    'rgb(154,204,233)',
  ];

  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartType = 'line';

  constructor(private api: ApiService) {
    // + 1 because js returns months index-off-by-one (0-11, not 1-12)
    this.lineChartLabels = AdminReferrerStatsComponent.getLast12Months().map(date => `${date.getMonth() + 1}-${date.getFullYear()}`);
  }

  ngOnInit(): void {
    const datesAreOnSameDay = (first: Date, second: Date) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();

    this.api.get<StatsResponse[]>('/admin/stats/referrer/monthly').subscribe(data => {
      this.loading = false;
      data.data.forEach((value: StatsResponse, index: number) => {
        const color = this.lineChartColors[index < this.lineChartColors.length - 1 ? index : 0];
        this.lineChartData[index] = {
          data: AdminReferrerStatsComponent.getLast12Months().map(month => {
            let foundIndex = value.count.findIndex(el => {
              return datesAreOnSameDay(new Date(el.date_trunc), month);
            });
            if (foundIndex === -1) {
              return 0;
            } else {
              return Number(value.count[foundIndex].count);
            }
          }),
          backgroundColor: color,
          hoverBackgroundColor: color,
          label: value.referrer
        };
      });
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
  count: MonthlyStat[];
  referrer: string;
}

export interface MonthlyStat {
  date_trunc: string;
  count: string;
}
