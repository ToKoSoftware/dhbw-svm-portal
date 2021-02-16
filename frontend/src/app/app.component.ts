import {AfterViewInit, Component, HostListener} from '@angular/core';
import {LoginService} from "./services/login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit  {
  public height = '100%';
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.calculateHeight();
  }

  constructor(
    public readonly session: LoginService
  ) {
  }

  ngAfterViewInit(): void {
    this.calculateHeight();
  }

  calculateHeight(): void {
    const bodyHeight = document.body.clientHeight;
    const topBarHeight = document.getElementById("topBar")?.offsetHeight || 60;
    this.height = bodyHeight - topBarHeight + 'px';
  }
}
