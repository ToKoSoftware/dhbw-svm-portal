import {NgModule} from '@angular/core';

import {FeatherModule} from 'angular-feather';
import {
  Activity,
  AlertCircle,
  BarChart2,
  Calendar,
  ChevronRight,
  DownloadCloud,
  Edit,
  File,
  Info,
  Key,
  Lock,
  LogIn,
  LogOut,
  Map,
  Minus,
  MousePointer,
  PieChart,
  Plus,
  Tool,
  Trash,
  UploadCloud,
  User,
  UserCheck,
  Users,
  X
} from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

// Select some icons (use an object, not an array)
const icons = {
  User,
  Users,
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
  LogIn,
  Tool, Activity, Calendar, UserCheck, Info, Lock, Edit, X, PieChart, Plus, ChevronRight, Minus
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
