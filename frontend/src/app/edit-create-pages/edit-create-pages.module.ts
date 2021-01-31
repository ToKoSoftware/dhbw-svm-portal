import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditUserComponent} from "./edit-user/edit-user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UiModule} from "../ui/ui.module";
import { EditEventComponent } from './edit-event/edit-event.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { EditPollComponent } from './edit-poll/edit-poll.component';

@NgModule({
  declarations: [EditUserComponent, EditEventComponent, EditNewsComponent, CreateNewsComponent, CreateEventComponent, CreatePollComponent, EditPollComponent],
    exports: [EditUserComponent, EditEventComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule
  ]
})
export class EditCreatePagesModule { }
