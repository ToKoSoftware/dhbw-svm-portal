import {Component, OnInit} from '@angular/core';
import {myProfileBreadcrumb, myProfilePages} from '../my-profile.pages';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {LoginService} from '../../services/login/login.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: 'app-credentials',
  templateUrl: './my-credentials.component.html',
})
export class MyCredentialsComponent implements OnInit {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
  public editUserForm: FormGroup;
  public loading = true;
  public currentUser: UserData;

  constructor(
    private readonly notifications: NotificationService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private loadingModalService: LoadingModalService,
    private login: LoginService) {
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    this.api.get<UserData>([`/users/${id}`, 1]).subscribe(
      (data) => {
        this.loading = false;
        this.currentUser = data.data;
        this.editUserForm = this.formBuilder.group(
          {
            email: [data.data.email, Validators.email],
            currentPassword: [''],
            password: ['', Validators.minLength(6)],
          }
        );
      }
    );
  }

  public updateUserPassword(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    const password = this.editUserForm.value.password;
    this.api.put<UserData>(
      [`/users/${id}`, 1],
      {password}).subscribe(
      data => {
        this.notifications.savedSuccessfully();
        this.currentUser = data.data;
        this.loading = false;
      },
      error => {
        this.notifications.savingFailed(error.data.error);
        this.loading = false;
      }
    );
  }

  public updateEmail(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    const email = this.editUserForm.value.email;
    this.api.put<{ user: UserData, jwt: string }>(
      [`/users/${id}`, 1],
      {email})
      .subscribe(
        data => {
          this.notifications.savedSuccessfully();
          this.loading = false;
          this.currentUser = data.data.user;
          this.login.login(data.data.jwt);
        },
        error => {
          this.notifications.savingFailed(error.error?.data.error);
          this.loading = false;
        }
      );
  }

}
