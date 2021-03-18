import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../auth/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { WisdomWizardsContract } from '../contracts/wisdom-wizards';
import { MatDialog } from '@angular/material/dialog';
import {
  ModalRegisterComponent
} from '../shared/modal-register/modal-register.component';
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
  lastTransactionID: Observable<string> = this._arweave.getLastTransactionID(this.mainAddress);
  otherDataInterval: any = null;

  constructor(
  	private _router: Router,
  	private _snackBar: MatSnackBar,
  	private _arweave: ArweaveService,
  	private _wisdomWizards: WisdomWizardsContract,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  	this.loading = true;
  	
  	if (!this.mainAddress) {
  		this.message('Please login first!', 'error');
  		this._router.navigate(['/home']);
      return;
  	}

  	// Fetch data to display
  	// this.loading is updated to false on success
  	this.getUserInfo();

    // Update last transaction every 15 seconds
    this.otherDataInterval = window.setInterval(() => {
      this.lastTransactionID = this._arweave.getLastTransactionID(this.mainAddress);
      this.balance = this._arweave.getAccountBalance(this.mainAddress);
      // this.getUserInfo();
    }, 30000);

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

    this.openModalRegister();

  }

  /*
  *  @dev Open modal
  */
  openModalRegister() {
    
    const refFileManager = this._dialog.open(ModalRegisterComponent, {
      width: '720px',
      data: { },
      disableClose: true
    });
    refFileManager.afterClosed().subscribe(result => {
      // alert(result);
      this.disableRegisterButton = false;
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
    window.clearInterval(this.otherDataInterval);
  }

  /*
  * @dev Reload page
  */
  reload() {
    window.location.reload();
  }


}
