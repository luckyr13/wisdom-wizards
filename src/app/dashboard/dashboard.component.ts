import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../auth/arweave.service';
import { Observable, Subscription } from 'rxjs';
import { WisdomWizardsContract } from '../contracts/wisdom-wizards'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
	mainAddress: string = this._arweave.getMainAddress();
	balance: Observable<string> = this._arweave.getAccountBalance(this.mainAddress);
	state: any = null;
	register$: Subscription|null = null;

  constructor(
  	private _router: Router,
  	private _snackBar: MatSnackBar,
  	private _arweave: ArweaveService,
  	private _wisdomWizards: WisdomWizardsContract
  ) { }

  ngOnInit(): void {
  	
  	if (!this.mainAddress) {
  		this.message('Please login first!', 'error');
  		this._router.navigate(['/home']);
  	}

  	this._wisdomWizards.getState(this._arweave.arweave).subscribe({
  		next: (state) => {
  			this.state = state;
  		},
  		error: (error) => {
  			this.message('Error!' + error, 'error');

  		}
  	});

  }

  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  register() {
  	this.register$ = this._wisdomWizards.register(
  		this._arweave.arweave,
  		this._arweave.getPrivateKey()
  	).subscribe({
  		next: (res) => {
  			this.message(`Success! TXID: ${res}`, 'success');

  		},
  		error: (error) => {
  			console.log('error', error);
  			this.message('Error!', 'error');
  		}
  	});
  }

  ngOnDestroy() {
  	if (this.register$) {
  		this.register$.unsubscribe();
  	}
  }


}
