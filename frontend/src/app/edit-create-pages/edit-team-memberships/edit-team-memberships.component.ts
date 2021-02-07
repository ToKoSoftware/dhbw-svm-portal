import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/data/users/users.service';
import {Subscription} from 'rxjs';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {UserData} from '../../interfaces/user.interface';
import {RolesService} from '../../services/data/roles/roles.service';
import {NotificationService} from '../../services/notification/notification.service';
import {TeamService} from '../../services/data/teams/team.service';

@Component({
  selector: 'app-edit-team-memberships',
  templateUrl: './edit-team-memberships.component.html'
})
export class EditTeamMembershipsComponent implements OnInit, OnDestroy {
  public selectedUsers: UserData[] = [];
  public availableUsers: UserData[] = [];
  @Input() editId: string = '';
  private userSubscription: Subscription;

  constructor(
    public readonly teams: TeamService,
    public readonly users: UsersService,
    private readonly loading: LoadingModalService,
    private readonly notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.showLoading();
    this.teams.read(this.editId).subscribe(
      team => {
        this.selectedUsers = team.users;
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
    this.teams.assignUserToTeam({team_id: this.editId, user_id: user.id})
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
    this.teams.removeUserFromTeam({team_id: this.editId, user_id: user.id})
      .subscribe(data => {
        this.loading.hideLoading();
        this.notification.savedSuccessfully();
        this.loadData();
      }, error => {
        console.log(error)
        this.loading.hideLoading();
        this.notification.savingFailed();
      });
  }

}
