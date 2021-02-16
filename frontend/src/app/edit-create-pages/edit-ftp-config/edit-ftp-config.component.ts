import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClipboardService} from 'ngx-clipboard';
import {NotificationService} from '../../services/notification/notification.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-edit-ftp-config',
  templateUrl: './edit-ftp-config.component.html'
})
export class EditFtpConfigComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    private readonly clipboardService: ClipboardService,
    private readonly formBuilder: FormBuilder,
    private readonly notifications: NotificationService,
    private readonly loading: LoadingModalService,
    private readonly api: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.formGroup = this.formBuilder.group(
      {
        password: [],
        user: [],
        host: [],
      }
    );
  }

  public saveData(): void {
    this.api.put('/ftp/configuration', this.formGroup.value).subscribe(
      () => this.notifications.savedSuccessfully(),
      () => this.notifications.savingFailed()
    );
  }

  private loadData(): void {
    this.loading.showLoading();
    this.api.get<{ password: string, host: string, user: string }>('/ftp/configuration').subscribe(
      (data) => {
        this.loading.hideLoading();
        this.formGroup = this.formBuilder.group(
          {
            password: [data.data.password],
            user: [data.data.user],
            host: [data.data.host],
          }
        );
      },
      () => this.notifications.savingFailed()
    );
  }


}
