import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {CommonModule} from '@angular/common';
import {pollsRoutes} from './polls.routes';
import {UiModule} from '../ui/ui.module';

@NgModule({
  imports: [
    pollsRoutes,
    CommonModule,
    UiModule
  ],
  exports: [RouterModule],
  declarations: [OverviewComponent]
})
export class PollsModule {
}
