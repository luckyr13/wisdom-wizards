import { Injectable } from '@angular/core';
import { 
	CanActivate, ActivatedRouteSnapshot,
	CanActivateChild,
	RouterStateSnapshot, UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { ArweaveService } from '../core/arweave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(
    private _arweave: ArweaveService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _auth: AuthService
   ) {

	}

	canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const langCode: string = route.paramMap.get('lang')!;
    return this.isLoggedIn(langCode);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.canActivate(route, state);
  }

  isLoggedIn(langCode: string): boolean {
  	const mainAddress = this._auth.getMainAddressSnapshot();
    const isLoggedIn = (mainAddress !== '');
    if (!isLoggedIn) {
      this.message('Please login first!', 'error');
      this._router.navigate([langCode, 'home']);
    }

  	return isLoggedIn;
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }
  
}
