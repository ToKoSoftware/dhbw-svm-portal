import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditUserComponent} from "./edit-user/edit-user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UiModule} from "../ui/ui.module";
import { EditEventComponent } from './edit-event/edit-event.component';

@NgModule({
  declarations: [EditUserComponent, EditEventComponent],
    exports: [EditUserComponent, EditEventComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ]
})
export class EditCreatePagesModule { }
