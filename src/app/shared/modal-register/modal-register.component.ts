import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { Router } from '@angular/router';
import { ArweaveService } from '../../core/arweave.service';
import { WisdomWizardsTokenContract } from '../../core/contracts/wisdom-wizards-token';
import {AuthService} from '../../auth/auth.service';
declare const window: any;

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss']
})
export class ModalRegisterComponent implements OnInit, OnDestroy {
	loadingState: boolean = false;
  loadingTransaction: boolean = false;
  registerFee: string = this._arweave.winstonToAr('10000000000');
  register$: Subscription = Subscription.EMPTY;
  txmessage: string = '';
  wisdomWizardsTokenContractState: any = null; 
  state$: Subscription = Subscription.EMPTY;
  balance: string = '0';

  constructor(
  		private _selfDialog: MatDialogRef<ModalRegisterComponent>,
      private _arweave: ArweaveService,
      private _snackBar: MatSnackBar,
      private _wisdomWizards: WisdomWizardsContract,
      private _router: Router,
      private _wisdomWizadsToken: WisdomWizardsTokenContract,
      private _auth: AuthService
  	) { }

  ngOnInit(): void {
  	this.loadingState = true;

  	this._arweave.getAccountBalance(this._auth.getMainAddressSnapshot()).subscribe({
  		next: (balance) => {
  			this.balance = balance;
          this.loadingState = false;
  		}, error: (error) => {
  			this.message(error, 'error');
  		}
  	});

/*
  	this.state$ = this._wisdomWizadsToken
  		.getCommunityState()
  		.subscribe({
  			next: (data) => {
  				this.wisdomWizardsTokenContractState = data;
  				this.loadingState = false;

          console.log('token data', this.wisdomWizardsTokenContractState)
  			},
  			error: (error) => {
  				this.message(error, 'error');
  				this.close();
  			}
  		});
      
*/

  }

  ngOnDestroy() {
    if (this.register$) {
    	this.register$.unsubscribe();
    }
  }

  close() {
  	this._selfDialog.close();
  }

  /*
  *  Custom snackbar message
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
  *	 Register user in platform and send the fee to PST
  */
  register(_fee: string) {    
    this.loadingTransaction = true;

  	this.register$ = this._wisdomWizards.register(
  		this._arweave.arweave,
  		this._auth.getPrivateKey()
  	).subscribe({
  		next: async (res) => {
  			this.message(`Success! TXID: ${res}`, 'success');
        this.txmessage = `https://viewblock.io/arweave/tx/${res}`;
        try {
        	const txFee = await this._arweave.sendFee(
        		this.wisdomWizardsTokenContractState,
        		_fee,
        		this._auth.getPrivateKey()
        	);
        	this.message(`Tx fee successful!`, 'success');

        } catch (err) {
        	console.log('error', err)
        	this.message(`Error sending fee!`, 'error');
        }

        window.setTimeout(() => {
        	this.close();
        	this._router.navigate(['/courses']);
        }, 10000);
  		},
  		error: (error) => {
        this.loadingTransaction = false;
  			console.log('error', error);
  			this.message('Error!', 'error');
  		}
  	});
  }

}
