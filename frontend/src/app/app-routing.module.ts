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
    canActivate: [IsLoggedInGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'my-profile',
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule)
  },
  {
    path: 'join',
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    loadChildren: () => import('./join/join.module').then(m => m.JoinModule)
  },
  {
    path: 'events',
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login-register/login-register.module').then(m => m.LoginRegisterModule)
  },
  {
    path: 'my-team',
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
