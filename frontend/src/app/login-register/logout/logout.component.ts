import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly login: LoginService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.login.logout();
    this.router.navigate(['/']);
  }

}
