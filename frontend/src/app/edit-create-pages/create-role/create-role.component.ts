import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {NotificationService} from '../../services/notification/notification.service';
import {RoleData} from '../../interfaces/role.interface';
import {RolesService} from '../../services/data/roles/roles.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html'
})
export class CreateRoleComponent implements OnInit {
  public formGroup: FormGroup;
  public current: RoleData;
  @Input() editId: string = '';

  constructor(
    public readonly roles: RolesService,
    private readonly formBuilder: FormBuilder,
    private readonly loadingModalService: LoadingModalService,
    private readonly slideOver: SlideOverService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        title: [],
        body: [],
      }
    );
    this.loadData();
  }

  public loadData() {
    this.roles.read(this.editId)
      .subscribe(
        d => {
          this.loadingModalService.hideLoading();
          this.current = d;
          this.formGroup = this.formBuilder.group(
            {
              title: [d.title],
            }
          );
        }, error => {
          this.loadingModalService.hideLoading();
          this.notificationService.loadingFailed();
        }
      );
  }

  public create(): void {
    if (this.formGroup.dirty && !this.formGroup.valid) {
      return;
    }
    this.roles.create({...this.formGroup.value}).subscribe(
      data => {
        this.current = data;
        this.slideOver.close();
        this.notificationService.savedSuccessfully();
      },
      error => {
        this.notificationService.savingFailed(error.error.data.error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

}
