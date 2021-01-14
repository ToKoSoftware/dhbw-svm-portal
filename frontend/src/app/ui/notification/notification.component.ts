import {Component, Input} from '@angular/core';
import {NotificationService, notificationType} from "../../services/notification/notification.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() type: notificationType = 'info';
  @Input() label: string = "";
  @Input() description: string = "";
  @Input() dismissible: boolean = true;
  @Input() id: string = "";

  constructor(public readonly notifications: NotificationService) {
  }

}
