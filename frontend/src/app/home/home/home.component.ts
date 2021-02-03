import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NewsService} from '../../services/data/news/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(public news: NewsService) {
  }

  ngOnInit(): void {
  }

}
