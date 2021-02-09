import {NgModule} from '@angular/core';

import {FeatherModule} from 'angular-feather';
import {
  User, Users, BarChart2, UploadCloud,
  DownloadCloud, Map, Trash, Key,
  MousePointer, AlertCircle, File, LogOut,
  LogIn, UserPlus, Tool, Activity,
  Calendar, UserCheck, Info, Lock, Edit,
  X, PieChart, Plus, ChevronRight, Minus,
  Check, Code, Shuffle, Copy
} from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

// Select some icons (use an object, not an array)
const icons = {
  User, Users, BarChart2, UploadCloud,
  DownloadCloud, Map, Trash, Key,
  MousePointer, AlertCircle, File, LogOut,
  LogIn, UserPlus, Tool, Activity,
  Calendar, UserCheck, Info, Lock, Edit,
  X, PieChart, Plus, ChevronRight, Minus,
  Check, Code, Shuffle, Copy
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
export class IconsModule {
}
