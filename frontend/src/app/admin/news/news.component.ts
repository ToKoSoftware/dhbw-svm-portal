import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {adminPages} from '../admin.pages';
import {NewsService} from '../../services/data/news/news.service';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  @ViewChild('newsCreate', {static: true}) newsCreate: TemplateRef<unknown>;

  constructor(public readonly news: NewsService,
              private readonly slideOver: SlideOverService,
              private readonly titleBarService: TitleBarService) { }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neue Nachricht',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('Nachricht anlegen', this.newsCreate);
      }
    }])
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

}
