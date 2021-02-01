import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';
import {NewsService} from '../../services/data/news/news.service';
import {NewsData} from '../../interfaces/news.interface';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html'
})
export class EditNewsComponent implements OnInit, OnChanges {
  public formGroup: FormGroup;
  public current: NewsData;
  @Input() editId: string = '';

  constructor(
    public readonly news: NewsService,
    private formBuilder: FormBuilder,
    private loadingModalService: LoadingModalService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
      }
    );
    this.news.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.formGroup = this.formBuilder.group(
            {
              title: [d.title],
              body: [d.body],
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.news.update({...this.current, ...this.formGroup.value, is_active: true}).subscribe(
      data => {
        this.current = data;
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

}
