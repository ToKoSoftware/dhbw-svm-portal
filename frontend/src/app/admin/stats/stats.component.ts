import {Component, OnInit} from '@angular/core';
import {adminPages} from '../admin.pages';
import {ApiService} from '../../services/api/api.service';
import {AdminCountStats} from '../../interfaces/stats.interface';
import {StatsResponse} from './admin-line-stats/admin-line-stats.component';

@Component({
  selector: 'app-overview',
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  public sidebarPages = adminPages;
  public monthlyData: StatsResponse | null = null;
  public tiles: StatisticTile[] = [{
    title: 'Benutzer',
    count: 0,
    icon: 'user',
    loading: true,
  }];

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.get<AdminCountStats>(['/admin/stats', 1]).subscribe(
      data => {
        const stats = data.data;
        this.tiles[0].count = stats.users;
        this.tiles[0].loading = false;
        /*this.tiles[1].count = stats.activeCustomers;
        this.tiles[1].loading = false;
        this.tiles[2].count = stats.activeOrders;
        this.tiles[2].loading = false;
        this.tiles[3].count = stats.activePlans;
        this.tiles[3].loading = false;*/
      },
      error => {

      }
    );
    this.api.get<StatsResponse>(['/admin/stats/monthly', 1]).subscribe(monthlyData => this.monthlyData = monthlyData.data);
  }
}

interface StatisticTile {
  title: string;
  icon: string;
  count: number;
  loading: boolean;
}
