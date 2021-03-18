import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WisdomWizardsContract } from '../../contracts/wisdom-wizards';
import { Router } from '@angular/router';
import { ArweaveService } from '../../auth/arweave.service';
import { WisdomWizardsTokenContract } from '../../contracts/wisdom-wizards-token';

declare const window: any;

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss']
})
export class ModalRegisterComponent implements OnInit, OnDestroy {
	loadingState: boolean = false;
  loadingTransaction: boolean = false;
  registerFee: string = this._arweave.winstonToAr('900000');
  register$: Subscription = Subscription.EMPTY;
  txmessage: string = '';
  wisdomWizardsTokenContractState: any = null; 
  state$: Subscription = Subscription.EMPTY;

  constructor(
  		private _selfDialog: MatDialogRef<ModalRegisterComponent>,
      private _arweave: ArweaveService,
      private _snackBar: MatSnackBar,
      private _wisdomWizards: WisdomWizardsContract,
      private _router: Router,
      private _wisdomWizadsToken: WisdomWizardsTokenContract
  	) { }

  ngOnInit(): void {
  	this.loadingState = true;

  	this.state$ = this._wisdomWizadsToken
  		.getState(this._arweave.arweave)
  		.subscribe({
  			next: (data) => {
  				this.wisdomWizardsTokenContractState = data;
  				this.loadingState = false;
  			},
  			error: (error) => {
  				this.message(error, 'error');
  				this.close();
  			}
  		});

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
  		this._arweave.getPrivateKey()
  	).subscribe({
  		next: async (res) => {
  			this.message(`Success! TXID: ${res}`, 'success');
        this.txmessage = `https://viewblock.io/arweave/tx/${res}`;
        try {
        	const txFee = await this._arweave.sendFee(
        		this.wisdomWizardsTokenContractState,
        		_fee,
        		this._arweave.getPrivateKey()
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
