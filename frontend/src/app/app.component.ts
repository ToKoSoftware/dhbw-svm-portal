import {Component} from '@angular/core';
import {LoginService} from "./services/login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    public readonly session: LoginService
  ) {
  }

}
