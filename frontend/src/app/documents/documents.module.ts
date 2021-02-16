import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import {documentsRoutes} from './documents.routes';
import {UiModule} from '../ui/ui.module';
import {IconsModule} from '../icons/icons.module';
import { UploadComponent } from './upload/upload.component';
import {DragDropDirective} from '../directives/drag-and-drop.directive';



@NgModule({
  declarations: [ListComponent, UploadComponent, DragDropDirective],
  imports: [
    documentsRoutes,
    CommonModule,
    UiModule,
    IconsModule
  ]
})
export class DocumentsModule { }
