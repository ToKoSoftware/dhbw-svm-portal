import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {setEmptyInputToNull} from '../../functions/input-cleaners.func';
import {TeamService} from '../../services/data/teams/team.service';
import {TeamData} from '../../interfaces/team.interface';
import {Subscription} from 'rxjs';
import {RolesService} from '../../services/data/roles/roles.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html'
})
export class CreateTeamComponent implements OnInit {
  public formGroup: FormGroup;
  public current: TeamData;
  public roleSelectData: [string | number, string | number][] = [];
  private roleSubscription: Subscription;

  constructor(
    public readonly teams: TeamService,
    public readonly roles: RolesService,
    private readonly formBuilder: FormBuilder,
    private readonly slideOverService: SlideOverService,
    private readonly loadingModalService: LoadingModalService,
    private readonly notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
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
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    let data = {
      ...this.formGroup.value
    };
    this.teams.create(data).subscribe(
      data => {
        this.current = data;
        this.slideOverService.close();
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
  }
}
