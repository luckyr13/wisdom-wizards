import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSettingsService } from '../core/user-settings.service';
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class InitPlatformGuard implements CanActivate, CanActivateChild {
  constructor(private _userSettings: UserSettingsService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('canActivate')
    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this._userSettings.scrollPageToTop();
    return true;
  }

	
  
}
