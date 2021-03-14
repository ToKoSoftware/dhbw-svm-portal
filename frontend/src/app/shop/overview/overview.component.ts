import { Component, OnInit } from '@angular/core';
import { ItemData } from 'src/app/interfaces/item.interface';
import { ItemsService } from '../../services/data/items/items.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {

  constructor(public readonly items: ItemsService) { }

  ngOnInit(): void {
  }

  public roundToTwoDigits(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2).toString().replace('.', ',');
  }

  public order(item: ItemData) {
    
  }

}

