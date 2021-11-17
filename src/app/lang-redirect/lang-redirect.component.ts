import { Component, OnInit, OnDestroy } from '@angular/core';
import { WisdomWizardsContract } from '../core/contracts/wisdom-wizards';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSettingsService } from '../core/user-settings.service';

@Component({
  selector: 'app-lang-redirect',
  templateUrl: './lang-redirect.component.html',
  styleUrls: ['./lang-redirect.component.scss']
})
export class LangRedirectComponent implements OnInit, OnDestroy {
	languages$ = this._wisdomWizards.getLanguages();
	langSubscription: Subscription = Subscription.EMPTY;
	loading: boolean = false;
	languages: any[] = [];
  loadingMainToolbar$ = this._userSettings.loading$;

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _snackBar: MatSnackBar,
    private _userSettings: UserSettingsService) { 
    }

  ngOnInit(): void {
  	this.loading = true;

  	this.langSubscription = this.languages$.subscribe({
  		next: (langs) => {
  			this.loading = false;
  			this.languages = Object.values(langs);
  			console.log(this.languages)
  		},
  		error: (error) => {
  			this.loading = false;
  			this.message(error, 'error');
  		}
  	});
  }

  ngOnDestroy() {
  	this.langSubscription.unsubscribe();
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
