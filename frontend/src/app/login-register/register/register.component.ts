import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(
    private router: Router,
    private readonly api: ApiService,
    private readonly loginService: LoginService,
    private readonly confirm: ConfirmModalService,
    private readonly loading: LoadingModalService) {
  }

  ngOnInit(): void {
  }

  public createUser(): void {
    this.api.post<UserData>('/users',
      {
        email: this.email,
        password: this.password
      }
    ).subscribe(
      (data) => {
        this.loading.hideLoading();
        this.login();
      }, error => {
        this.confirm.confirm({
          title: `Es ist ein Fehler beim Anlegen ihrers Accounts aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }

  private login(): void {
    this.loading.showLoading();
    this.api.post<string>('/login', {
      email: this.email,
      password: this.password,
    }).subscribe(
      data => {
        this.loginService.login(data.data);
        this.loading.hideLoading();
        this.router.navigate(['/']);
      }, error => {
        this.loading.hideLoading();
      }
    );
  }
}
