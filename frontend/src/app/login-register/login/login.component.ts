import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public error: boolean;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingModalService,
    private loginService: LoginService,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', Validators.email],
        password: [''],
      }
    );
  }

  public login(): void {
    if (!this.form.dirty || !this.form.valid) {
      return;
    }
    this.error = false;
    this.loading.showLoading();
    this.api.post<string>('/login', this.form.value).subscribe(
      data => {
        this.loginService.login(data.data);
        this.loading.hideLoading();
        this.router.navigate(['/']);
      }, error => {
        this.loading.hideLoading();
        this.error = true;
      }
    );
  }
}
