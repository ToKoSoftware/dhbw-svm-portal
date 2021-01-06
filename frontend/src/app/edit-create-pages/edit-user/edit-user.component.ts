import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserData} from "../../interfaces/user.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {LoadingModalService} from "../../services/loading-modal/loading-modal.service";
import {LoginService} from "../../services/login/login.service";
import {myProfileBreadcrumb, myProfilePages} from "../../my-profile/my-profile.pages";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit, OnChanges {
  public profilePages = myProfilePages;
  public breadcrumbs = myProfileBreadcrumb;
  public editUserForm: FormGroup;
  public loading = true;
  public currentUser: UserData;
  @Input() userId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private loadingModalService: LoadingModalService,
    private login: LoginService) { }

  ngOnInit(): void {
    this.userId = this.userId != '' ? this.userId : this.login.decodedJwt$.value?.id || '';
    this.loadUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadUser();
  }

  private loadUser(): void {
    this.loading = true;
    this.api.get<UserData>(`/users/${this.userId}`).subscribe(
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
