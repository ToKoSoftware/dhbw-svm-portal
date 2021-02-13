import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {adminPages} from '../admin.pages';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OrganizationsService} from '../../services/data/organizations/organizations.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {Subscription} from 'rxjs';
import {TitleBarService} from '../../services/title-bar/title-bar.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
  public sidebarPages = adminPages;
  public editOrgForm: FormGroup;
  private currentOrgSubscription: Subscription;
  @ViewChild('advanced', {static: true}) advanced: TemplateRef<unknown>;

  constructor(
    public readonly organizations: OrganizationsService,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
    private readonly loading: LoadingModalService,
    private readonly titleBarService: TitleBarService,
    private readonly formBuilder: FormBuilder,
    private readonly slideOver: SlideOverService) {
  }

  ngOnInit(): void {
    this.titleBarService.buttons$.next([{
      title: 'Entwickler',
      icon: 'code',
      function: () => {
        this.slideOver.showSlideOver('', this.advanced);
      }
    }]);
    this.loading.showLoading();
    this.editOrgForm = this.formBuilder.group(
      {
        title: [],
        access_code: [],
      }
    );
    this.currentOrgSubscription = this.currentOrg.currentOrg$.subscribe(
      org => {
        this.loading.hideLoading();
        if (org) {
          this.editOrgForm = this.formBuilder.group(
            {
              title: [org.title],
              access_code: [org.access_code],
            }
          );
        }
      }
    );
  }

  public save(): void {
    if (this.editOrgForm.dirty && !this.editOrgForm.valid) {
      return;
    }
    const data = {...this.editOrgForm.value, id: this.currentOrg.currentOrg$.getValue()?.id}
    this.organizations.update(data).subscribe();
  }

  ngOnDestroy(): void {
    this.currentOrgSubscription.unsubscribe();
    this.titleBarService.buttons$.next([]);
  }


}

