import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './core/user-settings.service';
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
  

	constructor(
		private _userSettings: UserSettingsService,) {
	}

	ngOnInit() {
		
	}
}
