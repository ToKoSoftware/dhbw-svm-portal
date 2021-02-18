import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {OrganizationData} from '../../interfaces/organization.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-create-org',
  templateUrl: './create-org.component.html'
})
export class CreateOrgComponent implements OnInit {
  public error: boolean;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingModalService,
    private loginService: LoginService,
    private router: Router,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: [''],
        access_code: ['', Validators.pattern('([A-Za-z0-9\\-\\_]+)')],
      }
    );
  }

  public login(): void {
    this.error = false;
    this.loading.showLoading();
    this.api.post<OrganizationData>('/organizations', this.form.value).subscribe(
      data => {
        this.loading.hideLoading();
        this.router.navigateByUrl('/login/register?code=' + this.form.value.access_code);
      }, error => {
        this.loading.hideLoading();
        this.error = true;
      }
    );
  }

}
