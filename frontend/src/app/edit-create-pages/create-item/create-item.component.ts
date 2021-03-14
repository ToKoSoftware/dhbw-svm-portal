import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemData } from 'src/app/interfaces/item.interface';
import { ItemsService } from 'src/app/services/data/items/items.service';
import { LoadingModalService } from 'src/app/services/loading-modal/loading-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SlideOverService } from 'src/app/services/slide-over/slide-over.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html'
})
export class CreateItemComponent implements OnInit {
  public formGroup: FormGroup;
  public current: ItemData;

  constructor(
    public readonly items: ItemsService,
    private readonly formBuilder: FormBuilder,
    private readonly slideOverService: SlideOverService,
    private readonly loadingModalService: LoadingModalService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        description: [],
        price: []
      }
    );
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    let itemData = {
      ...this.formGroup.value
    };
    this.loadingModalService.showLoading();
    itemData.price = Math.round(Number(itemData.price.replace(',', '.'))*100 + Number.EPSILON);
    this.items.create(itemData).subscribe(
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
