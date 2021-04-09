import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../auth/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { WisdomWizardsContract } from '../contracts/wisdom-wizards';
import { WisdomWizardsTokenContract } from '../contracts/wisdom-wizards-token';

import { AuthService } from '../auth/auth.service';
declare const window: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	mainAddress: string = this._auth.getMainAddressSnapshot();
	balance: Observable<string> = this._arweave.getAccountBalance(this.mainAddress);
	
  loading: boolean = false;
  txmessage: string = '';
  lastTransactionID: Observable<string> = this._arweave.getLastTransactionID(this.mainAddress);
  

  constructor(
  	private _router: Router,
  	private _snackBar: MatSnackBar,
  	private _arweave: ArweaveService,
  	private _wisdomWizards: WisdomWizardsContract,
    private _auth: AuthService,
    private _wisdomWizardsToken: WisdomWizardsTokenContract
  ) { }

  ngOnInit(): void {
  	this.loading = true;
  
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
  *	@dev Get user info
  */
  getUserInfo() {

    this.loading = false;
  }

  /*
  *	@dev Destroy subscriptions
  */
  ngOnDestroy() {
  }

  /*
  * @dev Reload page
  */
  reload() {
    window.location.reload();
  }


}
