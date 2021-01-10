import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivateChild, CanActivate {

  constructor(private readonly login: LoginService,
              private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.login.isLoggedIn$.value ? this.login.isLoggedIn$.value : this.getLoginUrlTree();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state);
  }

  protected getLoginUrlTree(): UrlTree {
    return this.router.parseUrl('login');
  }

}
