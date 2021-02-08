import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {TeamData} from '../../interfaces/team.interface';
import {TeamService} from '../../services/data/teams/team.service';
import {RolesService} from '../../services/data/roles/roles.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html'
})
export class EditTeamComponent implements OnInit, OnChanges {
  public formGroup: FormGroup;
  public current: TeamData;
  public roleSelectData: [string | number, string | number][] = [];
  private roleSubscription: Subscription;
  @Input() editId: string = '';

  constructor(
    public readonly teams: TeamService,
    public readonly roles: RolesService,
    private readonly formBuilder: FormBuilder,
    private readonly loadingModalService: LoadingModalService,
    private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        maintain_role_id: [],
      }
    );
    this.roleSubscription = this.roles.data$.subscribe(roles => {
      if (roles) {
        this.roleSelectData = roles.map(t => [t.id || '', t.title]);
      }
    });
    this.teams.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.formGroup = this.formBuilder.group(
            {
              title: [d.title],
              maintain_role_id: [d.maintain_role_id],
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public edit(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    let data = {
      ...this.current,
      ...this.formGroup.value,
      is_active: true
    };
    this.teams.update(data).subscribe(
      data => {
        this.current = data;
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editId !== this.current?.id)
      this.loadData();
  }

  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
  }

}
