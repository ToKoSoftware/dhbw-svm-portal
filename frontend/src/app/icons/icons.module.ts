import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { User, ShoppingCart, BarChart2, Map, Users, UploadCloud, DownloadCloud, Trash, Key, MousePointer, AlertCircle, File, LogOut, LogIn} from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

// Select some icons (use an object, not an array)
const icons = {
  User,
  Users,
  ShoppingCart,
  BarChart2,
  UploadCloud,
  DownloadCloud,
  Map,
  Trash,
  Key,
  MousePointer,
  AlertCircle,
  File,
  LogOut,
  LogIn
};

@NgModule({
  imports: [
    FeatherModule.pick(icons),
    CommonModule
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
