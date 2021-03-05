import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import {UiModule} from '../ui/ui.module';
import {aboutRoutes} from './about.routes';



@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    UiModule,
    aboutRoutes
  ]
})
export class AboutModule { }
