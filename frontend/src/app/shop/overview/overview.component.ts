import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemData } from '../../interfaces/item.interface';
import { SlideOverService } from '../../services/slide-over/slide-over.service';
import { ItemsService } from '../../services/data/items/items.service';
import { LoadingModalService } from 'src/app/services/loading-modal/loading-modal.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  public current: ItemData | null = null;
  @ViewChild('details', {static: true}) details: TemplateRef<unknown>;

  constructor(public readonly items: ItemsService,
    public readonly slideOver: SlideOverService,
    private readonly loading: LoadingModalService,
    private readonly confirm: ConfirmModalService
    ) { }

  ngOnInit(): void {
  }

  public roundToTwoDigits(n: number): string {
    return (Math.round(n * 100) / 100).toFixed(2).toString().replace('.', ',');
  }

  public async order(item: ItemData) {
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Möchten Soe "${item.title}" für ${this.roundToTwoDigits(item.price/100)}€ bestellen?`,
      confirmText: 'Kostenpflichtig bestellen',
      confirmButtonType: 'info'
    });
    if (!confirm){
      return;
    }
    this.items.order(item.id).subscribe(
      () => this.loading.hideLoading(),
      () => {
        this.loading.hideLoading();
      }
    );
    this.slideOver.close();
  }

}

