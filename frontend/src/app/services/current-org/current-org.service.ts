import {Injectable, OnDestroy} from '@angular/core';
import {LoginService} from '../login/login.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {UserData} from '../../interfaces/user.interface';
import {OrganizationData} from '../../interfaces/organization.interface';
import {UsersService} from '../data/users/users.service';
import {OrganizationsService} from '../data/organizations/organizations.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentOrgService implements OnDestroy {
  private userSubscription: Subscription;
  public currentOrg$: BehaviorSubject<null | OrganizationData> = new BehaviorSubject(null);
  public currentUser$: BehaviorSubject<null | UserData> = new BehaviorSubject(null);

  constructor(
    private readonly login: LoginService,
    private readonly users: UsersService,
    private readonly organizations: OrganizationsService,
  ) {
    this.userSubscription = this.login.decodedJwt$.subscribe(jwt => {
      if (jwt) {
        this.users.read(jwt.id).subscribe(
          (user: UserData) => {
            this.currentUser$.next(user);
            if (user.organization) {
              this.organizations.read(user.organization.id || '').subscribe(
                org => this.currentOrg$.next(org)
              );
            }
          }
        );
      } else {
        this.currentUser$.next(null);
        this.currentOrg$.next(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
