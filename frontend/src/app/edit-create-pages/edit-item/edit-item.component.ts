import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemData } from 'src/app/interfaces/item.interface';
import { ItemsService } from 'src/app/services/data/items/items.service';
import { LoadingModalService } from 'src/app/services/loading-modal/loading-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html'
})
export class EditItemComponent implements OnInit, OnChanges {
  public formGroup: FormGroup;
  public current: ItemData;
  @Input() editId: string = '';

  constructor(
    public readonly items: ItemsService,
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
    this.items.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.formGroup = this.formBuilder.group(
            {
              title: [d.title],
              description: [d.description],
              price: [d.price/100]
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public update(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    let itemData= {
      ...this.current,
      ...this.formGroup.value
    }
    itemData.price = Math.round(Number(itemData.price.replace(',', '.'))*100 + Number.EPSILON);
    this.items.update(itemData).subscribe(
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
    if (this.editId !== this.current?.id)
      this.loadData();
  }

}
