import {NgModule} from '@angular/core';

import {FeatherModule} from 'angular-feather';
import {
  User, Users, BarChart2, UploadCloud, Layers,
  DownloadCloud, Map, Trash, Key, Save, Clipboard,
  MousePointer, AlertCircle, File, LogOut,
  LogIn, UserPlus, Tool, Activity, Folder, FileText,
  Calendar, UserCheck, Info, Lock, Edit, EyeOff, List,
  X, PieChart, Plus, ChevronRight, ChevronLeft, Minus,
  Check, Code, Shuffle, Copy, CreditCard, Shield, ShoppingBag
} from 'angular-feather/icons';
import {CommonModule} from '@angular/common';

// Select some icons (use an object, not an array)
const icons = {
  User, Users, BarChart2, UploadCloud, Layers,
  DownloadCloud, Map, Trash, Key, Save, Clipboard,
  MousePointer, AlertCircle, File, LogOut,
  LogIn, UserPlus, Tool, Activity, Folder, FileText,
  Calendar, UserCheck, Info, Lock, Edit, EyeOff, List,
  X, PieChart, Plus, ChevronRight, ChevronLeft, Minus,
  Check, Code, Shuffle, Copy, CreditCard, Shield, ShoppingBag
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
