import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import jwt_decode from 'jwt-decode';
import {ApiService} from '../api/api.service';
import {UserData} from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public currentUser$: ReplaySubject<UserData | null> = new ReplaySubject();
  public jwt$: BehaviorSubject<string |null> = new BehaviorSubject(null);
  public decodedJwt$: BehaviorSubject<JWT |null> = new BehaviorSubject(null);

  constructor() {
    this.reloadJWT();
  }

  public login(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this.reloadJWT();
  }

  public logout(): void {
    localStorage.removeItem('jwt');
    this.reloadJWT();
  }

  private reloadJWT(): void {
    this.currentUser$.next(null);
    const jwt: string | null = localStorage.getItem('jwt');
    try {
      const decodedJWT = jwt_decode<JWT>(jwt || '');
      const now = new Date();
      const expiration = new Date(decodedJWT.exp * 1000);
      this.isLoggedIn$.next(expiration > now);
      this.jwt$.next(jwt);
      this.decodedJwt$.next(decodedJWT);
      this.isAdmin$.next(decodedJWT.is_admin);
    } catch (error) {
      this.isLoggedIn$.next(false);
    }
  }

}

export interface JWT {
  email: string;
  id: string;
  is_admin: boolean;
  iat: number;
  exp: number;
}
