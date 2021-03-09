import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../auth/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { WisdomWizardsContract } from '../contracts/wisdom-wizards';
declare const window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	mainAddress: string = this._arweave.getMainAddress();
	balance: Observable<string> = this._arweave.getAccountBalance(this.mainAddress);
	state: any = null;
	state$: Subscription = Subscription.EMPTY;
	register$: Subscription = Subscription.EMPTY;
	userInfo: any = {};
	userInfo$: Subscription = Subscription.EMPTY;
	loading: boolean = false;
  disableRegisterButton: boolean = false;
  txmessage: string = '';

  constructor(
  	private _router: Router,
  	private _snackBar: MatSnackBar,
  	private _arweave: ArweaveService,
  	private _wisdomWizards: WisdomWizardsContract
  ) { }

  ngOnInit(): void {
  	this.loading = true;
  	
  	if (!this.mainAddress) {
  		this.message('Please login first!', 'error');
  		this._router.navigate(['/home']);
  	}

  	// Fetch data to display
  	// this.loading is updated to false on success
  	this.getUserInfo();

  }

  /*
  *	Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  *	 Register user in platform
  */
  register() {
    this.disableRegisterButton = true;
  	this.register$ = this._wisdomWizards.register(
  		this._arweave.arweave,
  		this._arweave.getPrivateKey()
  	).subscribe({
  		next: (res) => {
        this.disableRegisterButton = false;
  			this.message(`Success! TXID: ${res}`, 'success');
        this.txmessage = `https://viewblock.io/arweave/tx/${res}`;

  		},
  		error: (error) => {
  			console.log('error', error);
  			this.message('Error!', 'error');
  		}
  	});
  }

  /*
  *	@dev Get user info
  */
  getUserInfo() {
  	this.userInfo$ = this._wisdomWizards.getUserInfo(
  		this._arweave.arweave,
  		this._arweave.getPrivateKey()
  	).subscribe({
  		next: (res) => {
        console.log('user', res, this._arweave.getPrivateKey(), this._arweave.arweave);

  			this.userInfo = res;
  			this.loading = false;

  		},
  		error: (error) => {
  			console.log('error', error);
  			this.message('Error!', 'error');
  		}
  	});
  }

  /*
  *	@dev Destroy subscriptions
  */
  ngOnDestroy() {
  	if (this.register$) {
  		this.register$.unsubscribe();
  	}
  	if (this.state$) {
  		this.state$.unsubscribe();
  	}
  	if (this.userInfo$) {
  		this.userInfo$.unsubscribe();
  	}
  }

  /*
  * @dev Reload page
  */
  reload() {
    window.location.reload();
  }


}
