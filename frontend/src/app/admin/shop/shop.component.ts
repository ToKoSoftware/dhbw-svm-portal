import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemData } from 'src/app/interfaces/item.interface';
import { ConfirmModalService } from 'src/app/services/confirm-modal/confirm-modal.service';
import { ItemsService } from 'src/app/services/data/items/items.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SlideOverService } from 'src/app/services/slide-over/slide-over.service';
import { TitleBarService } from 'src/app/services/title-bar/title-bar.service';
import {adminPages} from '../admin.pages';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public current: string;
  @ViewChild('create', {static: true}) create: TemplateRef<unknown>;
  @ViewChild('edit', {static: true}) edit: TemplateRef<unknown>;

  constructor(
    public readonly items: ItemsService,
    private readonly router: Router,
    private readonly confirm: ConfirmModalService,
    private readonly notifications: NotificationService,
    private readonly slideOver: SlideOverService,
    private readonly titleBarService: TitleBarService
  ) { }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Neuer Artikel',
      icon: 'plus',
      function: () => {
        this.slideOver.showSlideOver('', this.create);
      }
    }])
  }

  public editSlide(event: ItemData) {
    this.current = event.id || '';
    this.slideOver.showSlideOver('', this.edit);
  }

  ngOnDestroy() {
    this.titleBarService.buttons$.next([]);
  }

  public async delete(event: Event, itemData: ItemData): Promise<void> {
    event.stopPropagation();
    const confirm = await this.confirm.confirm({
      title: 'Löschen bestätigen',
      description: `Sind Sie sicher, dass sie "${itemData.title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`,
      confirmText: 'Löschen',
      confirmButtonType: 'danger'
    });
    if (!confirm){
      return;
    }
    this.items.delete(itemData).subscribe(
      () => this.notifications.deletedSuccessfully()
    );
  }

}
