import { Injectable } from '@angular/core';
import { 
	CanActivate, ActivatedRouteSnapshot,
	CanActivateChild,
	RouterStateSnapshot, UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { ArweaveService } from './arweave.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(private _arweave: ArweaveService) {

	}

	canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Please login to access this section.')
    return this.isLoggedIn();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Please login to access this section.', this.isLoggedIn())
    return this.isLoggedIn();
  }

  isLoggedIn(): boolean {
  	const mainAddress = this._arweave.getMainAddress();
  	return (mainAddress !== '');
  }
  
}
