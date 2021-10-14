import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserSettingsService } from '../core/user-settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { WisdomWizardsContract } from '../core/contracts/wisdom-wizards';
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class InitPlatformGuard implements CanActivate, CanActivateChild {
  constructor(
    private _userSettings: UserSettingsService,
    private _snackBar: MatSnackBar,
    private _wisdomWizards: WisdomWizardsContract) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeParams = route.params;
    const lang = Object.prototype.hasOwnProperty.call(routeParams, 'lang') ? 
      routeParams.lang : '';

    return this.validateRouteLang(lang);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this._userSettings.scrollPageToTop();
    return true;
  }

  loadWisdomContract(): Observable<boolean> {
    return of(true);
  }

  validateRouteLang(
    routeLang: string
  ): Observable<boolean> {
    this._userSettings.setLoading(true);
    if (routeLang === '') {
      this._userSettings.setShowMainToolbar(false);
      this._userSettings.setLoading(false);
      return of(true);
    }
    return this._wisdomWizards.getLanguages().pipe(
        map((langs: any) => {
          const isLangValid = Object.prototype.hasOwnProperty.call(langs, routeLang);
          this._userSettings.setLoading(false);
          if (isLangValid) {
            this._userSettings.setShowMainToolbar(true);
          } else {
            this.openSnackBar('Invalid language!', 'error')
          }
          return isLangValid;
        })
      );
  }

  openSnackBar(msg: string, cl: string= 'success') {
    this._snackBar.open(msg, 'x', {
      panelClass: cl,
      verticalPosition: 'bottom',
      duration: 2000
    });
  }

	
  
}
