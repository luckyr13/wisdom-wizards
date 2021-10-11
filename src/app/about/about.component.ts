import { Component, OnInit } from '@angular/core';
import { WisdomWizardsContract } from '../core/contracts/wisdom-wizards';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { ArweaveService } from '../core/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	loading: boolean = false;
	contractAddress: string = '';
	state: any = null;
	state$: Subscription = Subscription.EMPTY;
	
  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

  	this.loading = true;
  	this.contractAddress = this._wisdomWizards.getContractAddres();
  	// Update loading status inside function
  	this.getState();
  }

  /*
  *	 Get contract's state
  */
  getState() {
  	this.state$ = this._wisdomWizards.getState(this._arweave.arweave).subscribe({
  		next: (state) => {
  			this.state = state;
  			this.loading = false;
  		},
  		error: (error) => {
  			this.message('Error!' + error, 'error');

  		}
  	});
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

  getNumElements(obj: any) {
    return Object.keys(obj).length;
  }


}
