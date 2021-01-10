import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-admin-pie-stats',
  templateUrl: './admin-pie-stats.component.html',
  styleUrls: ['./admin-pie-stats.component.scss']
})
export class AdminPieStatsComponent implements OnInit {
  public loading = true;
  public stats: ReferrerStatItem[];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(250, 202, 21, 0.9)',
        'rgba(0,0,0,0.9)',
        'rgba(120,120,120,0.9)',
        'rgb(154,204,233)',
      ],
    },
  ];


  constructor(private api: ApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.api.get<ReferrerStatItem[]>('/admin/stats/referrer').subscribe(
      data => {
        this.loading = false;
        this.stats = data.data;
        this.pieChartLabels = data.data.map(d => d.referrer);
        this.pieChartData = data.data.map(d => Number(d.count));
      }
    );
  }

}

interface ReferrerStatItem {
  referrer: string;
  count: string;
}
