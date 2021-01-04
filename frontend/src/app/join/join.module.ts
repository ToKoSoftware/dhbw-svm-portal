import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import {joinRoutes} from "./join.routes";



@NgModule({
  declarations: [OverviewComponent],
  imports: [
    joinRoutes,
    CommonModule
  ]
})
export class JoinModule { }
