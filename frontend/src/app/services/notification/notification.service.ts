import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);

  public createNotification(n: Notification, time: number | null = 3000) {
    const currentNotifications = this.notifications$.getValue();
    currentNotifications.push(n);
    this.notifications$.next(currentNotifications);
    if (time !== null) {
      setTimeout(() => this.removeNotification(n.id), time);
    }
  }

  public removeNotification(id: string) {
    let currentNotifications = this.notifications$.getValue();
    currentNotifications = currentNotifications.filter(el => el.id !== id);
    this.notifications$.next(currentNotifications);
  }

}

export interface Notification {
  id: string;
  title: string;
  description: string;
  dismissible?: boolean;
  type: notificationType;
}
export type notificationType =  'info' | 'warning' | 'error';
