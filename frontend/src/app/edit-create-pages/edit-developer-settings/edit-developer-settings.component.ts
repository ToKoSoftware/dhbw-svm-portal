import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClipboardService} from 'ngx-clipboard';
import {ApiService} from '../../services/api/api.service';
import {NotificationService} from '../../services/notification/notification.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';

@Component({
  selector: 'app-edit-developer-settings',
  templateUrl: './edit-developer-settings.component.html'
})
export class EditDeveloperSettingsComponent implements OnInit {
  public editDevSettingsForm: FormGroup;

  constructor(
    private readonly clipboardService: ClipboardService,
    private readonly formBuilder: FormBuilder,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly api: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.editDevSettingsForm = this.formBuilder.group(
      {
        client_secret: [],
        application_name: ['', [Validators.pattern('([A-Za-z0-9\\-\\_]+)')]],
      }
    );
  }

  public createRandomClientSecret(): void {
    this.editDevSettingsForm.value.client_secret = Math.random().toString(36).substr(2, 12);
  }

  public copyToClipboard(item: 'client_secret' | 'sso_url' | 'oauth2_token_url') {
    let copyContent = '';
    switch (item) {
      case 'client_secret':
        copyContent = this.editDevSettingsForm.value.client_secret;
        break;
      case 'oauth2_token_url':
        copyContent = this.hostname + '/oauth2/token';
        break;
      case 'sso_url':
        copyContent = this.hostname + '/sso';
        break;
    }
    this.clipboardService.copy(copyContent);
  }

  get hostname(): string {
    return window.location.hostname;
  }

  public saveData(): void {
    this.api.put('/oauth2/configuration', this.editDevSettingsForm.value).subscribe(
      () => this.notifications.savedSuccessfully(),
      () => this.notifications.savingFailed()
    );
  }

  private loadData(): void {
    this.loading.showLoading();
    this.api.get<{ client_secret: string, application_name: string }>('/oauth2/configuration').subscribe(
      (data) => {
        this.loading.hideLoading();
        this.editDevSettingsForm = this.formBuilder.group(
          {
            client_secret: [data.data.client_secret],
            application_name: [data.data.application_name, [Validators.pattern('([A-Za-z0-9\\-\\_]+)')]],
          }
        );
      },
      () => this.notifications.savingFailed()
    );
  }
}
