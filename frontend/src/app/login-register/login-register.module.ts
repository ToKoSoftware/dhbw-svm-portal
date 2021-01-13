import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {loginRegisterRoutes} from './login-register.routes';
import {UiModule} from '../ui/ui.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LogoutComponent} from './logout/logout.component';

@NgModule({
    declarations: [RegisterComponent, LoginComponent, LogoutComponent],
    exports: [
        LoginComponent
    ],
    imports: [
        loginRegisterRoutes,
        CommonModule,
        FormsModule,
        UiModule,
        ReactiveFormsModule
    ]
})
export class LoginRegisterModule {
}
