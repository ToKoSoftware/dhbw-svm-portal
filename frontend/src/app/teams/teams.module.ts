import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import {teamsRoutes} from './teams.routes';



@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    teamsRoutes
  ]
})
export class TeamsModule { }
