import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/data/users/users.service';
import {Subscription} from 'rxjs';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {UserData} from '../../interfaces/user.interface';
import {RolesService} from '../../services/data/roles/roles.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-edit-role-memberships',
  templateUrl: './edit-role-memberships.component.html'
})
export class EditRoleMembershipsComponent implements OnInit, OnDestroy {
  public selectedUsers: UserData[] = [];
  public availableUsers: UserData[] = [];
  @Input() editId: string = '';
  private userSubscription: Subscription;

  constructor(
    public readonly roles: RolesService,
    public readonly users: UsersService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.roles.read(this.editId).subscribe(
      role => {
        this.selectedUsers = role.users;
        this.userSubscription = this.users.data$.subscribe(
          users => {
            if (users) {
              this.loading.hideLoading();
              const userIds = this.selectedUsers.map(user => user.id);
              this.availableUsers = users.filter(availableUser => !userIds.includes(availableUser.id));
            }
          }
        );
      },
      error => {
        this.notification.loadingFailed();
        this.loading.hideLoading();
      }
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  public addToRole(user: UserData): void {
    this.loading.showLoading();
    this.roles.assignUserToRole({roleId: this.editId, userId: user.id})
      .subscribe(data => {
        this.loading.showLoading();
      }, error => {
        this.loading.hideLoading();
        this.notification.savingFailed();
      });
  }

}
