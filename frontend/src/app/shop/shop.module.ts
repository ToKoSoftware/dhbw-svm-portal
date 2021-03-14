import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { UiModule } from '../ui/ui.module';
import { shopRoutes } from './shop.routes';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    UiModule,
    shopRoutes
  ],
  exports: [RouterModule],
})
export class ShopModule { }
