import {Component, Input, OnInit} from '@angular/core';
import {NewsData} from '../../interfaces/news.interface';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit {
  @Input() public news: NewsData;
  constructor() { }

  ngOnInit(): void {
  }

}
