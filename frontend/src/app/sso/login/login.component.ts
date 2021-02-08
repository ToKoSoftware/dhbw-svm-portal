import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoginService} from '../../services/login/login.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public ssoData: SSOData = {
    client_id: '',
    redirect_uri: '',
    scope: '',
    state: '',
    response_type: 'code'
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly session: LoginService,
    private readonly notification: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe(params => {
      this.ssoData.client_id = params.client_id || '';
      this.ssoData.redirect_uri = params.redirect_uri || '';
      this.ssoData.state = params.state || '';
      this.ssoData.scope = params.scope || '';
      this.ssoData.response_type = params.response_type || '';
    });
    if (!this.session.isLoggedIn$) {
      this.notification.createNotification({
        id: Math.random().toString(36).substring(7),
        title: `Bitte loggen Sie sich ein.`,
        description: 'Sie werden anschließend weitergeleitet.',
        type: 'info'
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirect(): void {
    const urlParams = new URLSearchParams();
    urlParams.append('client_id', this.ssoData.client_id);
    urlParams.append('redirect_uri', this.ssoData.redirect_uri);
    urlParams.append('scope', this.ssoData.scope);
    urlParams.append('state', this.ssoData.state);
    urlParams.append('response_type', this.ssoData.response_type);
    urlParams.append('token', this.session.jwt$.value || '');
    console.log(this.session.jwt$.value);
    window.location.assign(`/api/v2/oauth2?${urlParams}`);
  }
}

interface SSOData {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope: string;
  response_type: 'code'; // for now, only code is supported
}
