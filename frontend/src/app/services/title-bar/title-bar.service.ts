import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TitleBarService {
  public title$: BehaviorSubject<string> = new BehaviorSubject('Mein Verein');

  constructor() {
  }
}
