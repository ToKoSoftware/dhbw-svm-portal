import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {LoginService} from '../../services/login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {UsersService} from '../../services/data/users/users.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganizationsService} from '../../services/data/organizations/organizations.service';
import {NotificationService} from '../../services/notification/notification.service';
import {OrganizationData} from '../../interfaces/organization.interface';
import {SlideOverService} from '../../services/slide-over/slide-over.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
    input:checked + svg {
      display: block;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  public currentOrg: OrganizationData | null = null;
  @ViewChild('privacy', {static: true}) privacy: TemplateRef<unknown>;
  public availableGenderOptions: [string | number, string | number][] = [['M', 'Männlich'], ['W', 'Weiblich'], ['D', 'Divers']];
  public step = 1;
  public error = false;
  public formGroup: FormGroup;
  private subscription: Subscription = new Subscription();
  public createUserData: CreateUserData = {
    email: '',
    access_code: '',
    password: '',
    first_name: '',
    last_name: '',
    street: '',
    street_number: '',
    username: '',
    post_code: '',
    gender: '',
    birthday: '',
    city: '',
  };

  constructor(
    private readonly organization: OrganizationsService,
    private readonly slideOver: SlideOverService,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly users: UsersService,
    private readonly formBuilder: FormBuilder,
    private readonly loginService: LoginService,
    private readonly notificationService: NotificationService,
    private readonly confirm: ConfirmModalService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly loading: LoadingModalService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        email: [],
        access_code: [],
        password: [],
        first_name: [],
        last_name: [],
        street: [],
        street_number: [],
        post_code: ['', Validators.minLength(5)],
        gender: ['M'],
        username: [],
        birthday: [],
        city: [],
        accepted_privacy_policy: [],
      }
    );
    this.subscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
        this.formGroup.patchValue({access_code: params.code});
        this.checkOrganization();
      }
    });
  }

  public createUser(): void {
    // if current step is not final step, enter has been pressed before form is completed
    if (this.step !== 4) {
      switch (this.step) {
        case 1:
          return this.checkOrganization();
        case 2:
          return this.checkNameData();
        case 3:
          return this.checkBirthdayAndGenderData();
      }
    }
    if (this.currentOrg?.privacy_policy_text) {
      if (!this.formGroup.value.accepted_privacy_policy) {
        this.confirm.confirm({
          title: `Datenschutz`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Um das Portal nutzen zu können, müssen Sie der Datenenschutzvereinbarung des Vereins zustimmen.',
          showCancelButton: false
        });
        return;
      }
    }
    let data = {
      ...this.createUserData,
      password: this.formGroup.value.password,
      username: this.formGroup.value.username,
      email: this.formGroup.value.email,
      accepted_privacy_policy: true
    };
    this.users.create(data as any).subscribe(
      (data) => {
        setTimeout(this.login, 2000);
      }, error => {
        this.loading.hideLoading();
        this.confirm.confirm({
          title: `Es ist ein Fehler beim Anlegen Ihres Accounts aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }

  private login(): void {
    this.loading.showLoading();
    this.api.post<string>(['/login', 1], {
      email: this.createUserData.email,
      password: this.createUserData.password,
    }).subscribe(
      data => {
        this.loginService.login(data.data);
        this.loading.hideLoading();
        this.router.navigate(['/']);
        this.notificationService.createNotification({
          id: Math.random().toString(36).substring(7),
          title: 'Willkommen!',
          description: 'Herzlich Willkommen im Vereinsportal!',
          type: 'info'
        });
      }, error => {
        this.loading.hideLoading();
      }
    );
  }

  public checkOrganization(): void {
    this.organization.getByAccessCode(this.formGroup.value.access_code).subscribe(
      org => {
        this.notificationService.createNotification({
          id: Math.random().toString(36).substring(7),
          title: 'Verein gefunden',
          description: org.title,
          type: 'info'
        }, 10000);
        this.createUserData.access_code = this.formGroup.value.access_code;
        this.currentOrg = org;
        this.step++;
      },
      error => {
        this.notificationService.createNotification({
          id: Math.random().toString(36).substring(7),
          title: 'Fehler',
          description: 'Der Verein konnte nicht gefunden werden.',
          type: 'error'
        });
      }
    );
  }

  public checkNameData(): void {
    let currentlyValidFields = this.getValidFormFieldNames();
    // all fields that are required to be valid
    const requiredFieldsForNextStep = [
      'first_name',
      'last_name',
      'street',
      'street_number',
      'post_code',
      'city',
      'access_code'
    ];
    const valid = requiredFieldsForNextStep.every(
      // remove fields that are displayed in next step
      field => {
        return currentlyValidFields.includes(field) || ['email', 'password', 'access_code'].includes(field);
      });
    if (valid) {
      this.step++;
      this.error = false;
      requiredFieldsForNextStep.forEach(field => this.createUserData[field as UserDataType] = this.formGroup.value[field]);
      return;
    }
    this.error = true;
  }

  public checkBirthdayAndGenderData(): void {
    let currentlyValidFields = this.getValidFormFieldNames();
    // all fields that are required to be valid
    const requiredFieldsForNextStep = [
      'gender',
      'birthday',
    ];
    const valid = requiredFieldsForNextStep.every(
      // remove fields that are displayed in next step
      field => {
        console.log(currentlyValidFields.includes(field) || ['email', 'password'].includes(field), field);
        return currentlyValidFields.includes(field) || ['email', 'password'].includes(field);
      });
    if (valid) {
      this.step++;
      this.error = true;
      requiredFieldsForNextStep.forEach(field => this.createUserData[field as UserDataType] = this.formGroup.value[field]);
      return;
    }
    this.error = true;
  }

  private getValidFormFieldNames() {
    const valid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
      if (!controls[name].invalid) {
        valid.push(name);
      }
    }
    return valid;
  }

  public showPrivacySlideOver(event: Event) {
    event.stopPropagation();
    if (!this.currentOrg) {
      return;
    }
    this.slideOver.showSlideOver('Datenschutzbestimmungen des Vereins "' + this.currentOrg.title + '"', this.privacy);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

export type CreateUserData = { [key in UserDataType]: string; };

export type UserDataType = 'email' |
  'password' |
  'street' |
  'gender' |
  'access_code' |
  'first_name' |
  'last_name' |
  'username' |
  'street_number' |
  'birthday' |
  'post_code' |
  'city';
