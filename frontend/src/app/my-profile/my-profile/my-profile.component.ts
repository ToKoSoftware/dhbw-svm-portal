import { Component, OnInit } from '@angular/core';
import {myProfileBreadcrumb, myProfilePages} from "../my-profile.pages";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserData} from "../../interfaces/user.interface";
import {ApiService} from "../../services/api/api.service";
import {LoadingModalService} from "../../services/loading-modal/loading-modal.service";
import {LoginService} from "../../services/login/login.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
  public editUserForm: FormGroup;
  public loading = true;
  public currentUser: UserData;

  constructor(
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
    this.api.get<UserData>(`/users/${id}`).subscribe(
      (data) => {
        this.loading = false;
        this.currentUser = data.data;
        this.editUserForm = this.formBuilder.group(
          {
            email: [data.data.email],
            firstName: [data.data.firstName],
            lastName: [data.data.lastName],
            city: [data.data.city],
            postcode: [data.data.postcode],
            street: [data.data.street],
            streetNumber: [data.data.streetNumber],
          }
        );
      }
    );
  }

  public updateUser(): void {
    this.loading = true;
    const id = this.login.decodedJwt$.value?.id || '';
    const password = this.editUserForm.value.password;
    this.api.put<UserData>(
      `/users/${id}`,
      this.editUserForm.value
      ).subscribe(
      data => {
        this.currentUser = data.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

}
