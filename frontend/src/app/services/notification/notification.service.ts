import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject([]);

  public createNotification(n: Notification, time: number | null = 3000): void {
    const currentNotifications = this.notifications$.getValue();
    currentNotifications.push(n);
    this.notifications$.next(currentNotifications);
    if (time !== null) {
      setTimeout(() => this.removeNotification(n.id), time);
    }
  }

  public removeNotification(id: string): void {
    let currentNotifications = this.notifications$.getValue();
    currentNotifications = currentNotifications.filter(el => el.id !== id);
    this.notifications$.next(currentNotifications);
  }

  public savedSuccessfully(): void {
    this.createNotification(
      {
        id: Math.random().toString(36).substring(7),
        title: 'Speichern erfolgreich',
        description: 'Ihre Änderungen wurden übernommen',
        type: 'info'
      }
    );
  }

  public savingFailed(error = ''): void {
    const description = error != '' ? error : 'Ihre Änderungen wurden nicht übernommen';
    console.log(
      {
        id: Math.random().toString(36).substring(7),
        title: 'Speichern fehlgeschlagen',
        description,
        type: 'error'
      })
    this.createNotification(
      {
        id: Math.random().toString(36).substring(7),
        title: 'Speichern fehlgeschlagen',
        description,
        type: 'error'
      }
    );
  }

}

export interface Notification {
  id: string;
  title: string;
  description: string;
  dismissible?: boolean;
  type: notificationType;
}

export type notificationType = 'info' | 'warning' | 'error';
