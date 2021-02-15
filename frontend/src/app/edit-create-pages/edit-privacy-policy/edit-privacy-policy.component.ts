import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {OrganizationsService} from '../../services/data/organizations/organizations.service';
import {CurrentOrgService} from '../../services/current-org/current-org.service';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {SlideOverService} from '../../services/slide-over/slide-over.service';

@Component({
  selector: 'app-edit-privacy-policy',
  templateUrl: './edit-privacy-policy.component.html'
})
export class EditPrivacyPolicyComponent implements OnInit, OnDestroy {
  public editOrgForm: FormGroup;
  private currentOrgSubscription: Subscription;

  constructor(
    public readonly organizations: OrganizationsService,
    public readonly currentOrg: CurrentOrgService,
    private readonly api: ApiService,
    private readonly loading: LoadingModalService,
    private readonly formBuilder: FormBuilder,
    public readonly slideOver: SlideOverService) {
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.editOrgForm = this.formBuilder.group(
      {
        privacy_policy_text: [],
      }
    );
    this.currentOrgSubscription = this.currentOrg.currentOrg$.subscribe(
      org => {
        if (org) {
          this.loading.hideLoading();
          this.editOrgForm = this.formBuilder.group(
            {
              privacy_policy_text: [org.privacy_policy_text],
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
    const data = {...this.editOrgForm.value, id: this.currentOrg.currentOrg$.getValue()?.id};
    this.organizations.update(data).subscribe(updatedOrg => {
      this.currentOrg.currentOrg$.next(updatedOrg);
      this.slideOver.close();
    });
  }

  ngOnDestroy(): void {
    this.currentOrgSubscription.unsubscribe();
  }

}
