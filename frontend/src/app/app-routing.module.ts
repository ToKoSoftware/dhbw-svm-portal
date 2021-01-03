import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from './error/error404/error404.component';
import {CommonModule} from '@angular/common';
import {IsLoggedInGuard} from './guards/is-logged-in.guard';
import {IsAdminGuard} from './guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'profile',
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login-register/login-register.module').then(m => m.LoginRegisterModule)
  },
  {
    path: 'admin',
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    canActivateChild: [IsLoggedInGuard, IsAdminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    component: Error404Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
