import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './core/user-settings.service';
import { AuthService } from './auth/auth.service';
import { ArweaveService } from './core/arweave.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	opened: boolean = false;
  platformLoading$: Observable<boolean> = this._userSettings.loading$;
  showMainToolbar$: Observable<boolean> = this._userSettings.showMainToolbar$;
  routeLang: string = '';
  mainAddress$ = this._auth.account$;
  network$ = this._arweave.getNetworkName();

	constructor(
		private _userSettings: UserSettingsService,
		private _auth: AuthService,
		private _arweave: ArweaveService) {

	}

	ngOnInit() {
		this._userSettings.routeLang$.subscribe({
			next: (lang) => {
				this.routeLang = lang;
			}
		})
	}
}
