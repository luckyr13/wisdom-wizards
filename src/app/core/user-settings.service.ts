import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
	private _defaultTheme: string = '';
	private _defaultLang: string = '';
  private _loading: Subject<boolean> = new Subject<boolean>();
  public loading$ = this._loading.asObservable();
  private _showMainToolbar: Subject<boolean> = new Subject<boolean>();
  public showMainToolbar$ = this._showMainToolbar.asObservable();

  constructor() {
  	const dtheme = window.sessionStorage.getItem('defaultTheme');
  	const dlang = window.sessionStorage.getItem('defaultLang');
    this.setLoading(false);
    this.setShowMainToolbar(false);

  	// Default settings
  	if (dtheme) {
  		this.setTheme(dtheme);
  	} else {
  		this.setTheme('light-theme');
  	}
  	if (dlang) {
  		this.setDefaultLang(dlang);
  	} else {
  		this.setDefaultLang('EN');
  	}

  }

  setLoading(_isLoading: boolean) {
    this._loading.next(_isLoading);
  }

  setShowMainToolbar(_show: boolean) {
    this._showMainToolbar.next(_show);
  }

  getDefaultTheme(): string {
  	return this._defaultTheme;
  }

  getDefaultLang(): string {
  	return this._defaultLang;
  }

  setDefaultTheme(_theme: string) {
  	if (_theme) {
    	this._defaultTheme = _theme;
    	window.sessionStorage.setItem('defaultTheme', this._defaultTheme);
  	}
  }

  setDefaultLang(_lang: string) {
  	if (_lang) {
  		this._defaultLang = _lang;
    	window.sessionStorage.setItem('defaultLang', this._defaultLang);
  	}
  }

  resetUserSettings() {
  	this._defaultLang = 'EN';
  	this._defaultTheme = 'light-theme';
  	window.sessionStorage.removeItem('defaultTheme');
  	window.sessionStorage.removeItem('defaultLang');

  }

  /*
  *  Set default theme (Updates the href property)
  */
  setTheme(theme: string) {
    const _ts: any = document.getElementById('LINK_MAIN_TEMPLATE');
    if (!_ts) {
      throw Error('Error updating theme');
    }
    switch (theme) {
      case 'light-theme':
        _ts.href = `./assets/css/${theme}.css`;
        this.setDefaultTheme(theme);
      break;
      case 'dark-theme':
        _ts.href = `./assets/css/${theme}.css`;
        this.setDefaultTheme(theme);
      break;
      default:
      	throw Error('Theme not found!');
      break;
    }

  }

  scrollPageToTop() {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    if (container) {
      container.scrollTop = 0;
    }
  }

  scrollTo(to_id: string, offset: number = 0) {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    const to = document.getElementById(to_id);
    const toData = to.getBoundingClientRect();
    container.scrollTop += toData.top + offset;
  }


}
