import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import {UiModule} from '../ui/ui.module';



@NgModule({
  declarations: [Error404Component],
  imports: [
    CommonModule,
    UiModule
  ]
})
export class ErrorModule { }
