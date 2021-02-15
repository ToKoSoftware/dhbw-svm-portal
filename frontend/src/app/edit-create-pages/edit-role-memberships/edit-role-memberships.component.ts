import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
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
export class EditRoleMembershipsComponent implements OnDestroy, OnChanges {
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

  private loadData(): void {
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
    this.roles.assignUserToRole({role_id: this.editId, user_id: user.id})
      .subscribe(data => {
        this.loading.hideLoading();
        this.loadData();
      }, error => {
        this.loading.hideLoading();
        this.notification.savingFailed();
      });
  }

  public removeFromRole(user: UserData): void {
    this.loading.showLoading();
    this.roles.removeRoleFromUser({role_id: this.editId, user_id: user.id})
      .subscribe(data => {
        this.loading.hideLoading();
        this.notification.savedSuccessfully();
        this.loadData();
      }, error => {
        console.log(error);
        this.loading.hideLoading();
        this.notification.savingFailed();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editId) {
      if (changes.editId.previousValue !== changes.editId.currentValue) {
        this.loadData();
      }
    }
  }

}
