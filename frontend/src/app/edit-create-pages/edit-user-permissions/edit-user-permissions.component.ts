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
  selector: 'app-edit-user-permissions',
  templateUrl: './edit-user-permissions.component.html'
})
export class EditUserPermissionsComponent implements OnInit, OnChanges {
  public loading = true;
  public currentUser: UserData;
  @Input() userId: string = '';

  constructor(
    private readonly users: UsersService,
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
      });
  }

}
