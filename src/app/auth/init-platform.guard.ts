import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class InitPlatformGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.scrollToTop();
    return true;
  }

  
	scrollToTop() {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    if (container) {
    	container.scrollTop = 0;
    }
  }
  
}
