import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { UiModule } from '../ui/ui.module';
import { shopRoutes } from './shop.routes';
import { RouterModule } from '@angular/router';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';



@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    UiModule,
    shopRoutes,
    MarkdownToHtmlModule
  ],
  exports: [RouterModule],
})
export class ShopModule { }
