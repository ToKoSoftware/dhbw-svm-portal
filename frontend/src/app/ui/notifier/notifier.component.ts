import {Component} from '@angular/core';
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
})
export class NotifierComponent {
  constructor(public readonly notifications: NotificationService) {
  }
}
