import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {NewsService} from '../../services/data/news/news.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {NewsData} from '../../interfaces/news.interface';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public current: string;
  @ViewChild('newsCreate', {static: true}) newsCreate: TemplateRef<unknown>;
  @ViewChild('newsEdit', {static: true}) newsEdit: TemplateRef<unknown>;

  constructor(public readonly news: NewsService,
              private readonly slideOver: SlideOverService,
              private readonly titleBarService: TitleBarService) { }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Nachricht',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.newsCreate);
      }
    }])
  }

  public edit(news: NewsData) {
    this.current = news.id || '';
    this.slideOver.showSlideOver('', this.newsEdit);

  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

}
