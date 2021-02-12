import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserData} from '../../interfaces/user.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {myProfileBreadcrumb, myProfilePages} from '../../my-profile/my-profile.pages';
import {UsersService} from '../../services/data/users/users.service';
import {NotificationService} from '../../services/notification/notification.service';

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
    private readonly users: UsersService,
    private readonly formBuilder: FormBuilder,
    private readonly notifications: NotificationService,
    private readonly api: ApiService,
    private readonly loadingModalService: LoadingModalService,
    private readonly login: LoginService) {
  }

  ngOnInit(): void {
    this.userId = this.userId != '' ? this.userId : this.login.decodedJwt$.value?.id || '';
    this.loadUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadUser();
  }

  private loadUser(): void {
    this.loading = true;
    this.users.read(this.userId).subscribe(
      (user) => {
        this.loading = false;
        this.currentUser = user;
        this.editUserForm = this.formBuilder.group(
          {
            email: [user.email],
            first_name: [user.first_name],
            last_name: [user.last_name],
            city: [user.city],
            birthday: [user.birthday],
            postcode: [user.post_code, Validators.minLength(5)],
            street: [user.street],
            street_number: [user.street_number],
          }
        );
      });
  }

  public updateUser(): void {
    if (this.editUserForm.dirty && !this.editUserForm.valid) {
      return;
    }
    this.loading = true;
    const data = {id: this.currentUser.id, ...this.editUserForm.value};
    this.users.update(data).subscribe(
      data => {
        this.currentUser = data;
        this.notifications.savedSuccessfully();
        this.loading = false;
      },
      error => {
        this.notifications.savingFailed();
        this.loading = false;
      }
    );
  }

}
