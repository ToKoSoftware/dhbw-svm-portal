import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {NewsData} from '../../interfaces/news.interface';
import {NewsService} from '../../services/data/news/news.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html'
})
export class CreateNewsComponent implements OnInit {
  public formGroup: FormGroup;
  public current: NewsData;
  @Input() editId: string = '';

  constructor(
    public readonly news: NewsService,
    private formBuilder: FormBuilder,
    private slideOverService: SlideOverService,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.news.read(this.editId)
      .subscribe(
        d => this.current = d,
      );
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
      }
    );
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    console.log({...this.formGroup.value, is_active: true});
    this.loadingModalService.showLoading();
    this.news.create({...this.formGroup.value, is_active: true}).subscribe(
      data => {
        this.current = data;
        this.loadingModalService.hideLoading();
        this.notificationService.savedSuccessfully();
        this.slideOverService.close();
      },
      error => {
        this.loadingModalService.hideLoading();
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

}
