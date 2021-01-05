import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly login: LoginService,
    private readonly router: Router,
    private readonly notifications: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.login.logout();
    this.router.navigate(['/']);
    this.notifications.createNotification({id: 'logout', title: 'Erfolgreich abgemeldet', description: 'Auf Wiedersehen!', type: 'info'})
  }

}
