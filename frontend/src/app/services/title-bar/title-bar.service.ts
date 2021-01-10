import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UiButton} from "../../ui/ui.interface";

@Injectable({
  providedIn: 'root'
})
export class TitleBarService {
  public title$: BehaviorSubject<string> = new BehaviorSubject('Mein Verein');
  public buttons$: BehaviorSubject<UiButton[]> = new BehaviorSubject([]);

  constructor() {
  }
}
