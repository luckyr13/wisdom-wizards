import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../auth/arweave.service';
import { Subscription, EMPTY } from 'rxjs';
import { INetworkResponse } from '../auth/INetworkResponse';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy {
	network: string = 'Not connected';
  account: string = 'Not connected';
	network$: Subscription = Subscription.EMPTY;

  constructor(
  	private _bottomSheet: MatBottomSheet,
  	private _auth: AuthService,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.network$ = this._arweave.getNetworkInfo().subscribe({
      next: (res: INetworkResponse) => {
        this.network = res.network;
      },
      error: (error) => {
        this.message(`Error: ${error}`, 'error');
      }
    });

    this._auth.account$.subscribe((_account) => {
      this.account = _account;
    })
  }

  ngOnDestroy(): void {
  	if (this.network$) {
  		this.network$.unsubscribe();
  	}
  }



  login() {
  	this._bottomSheet.open(ModalLoginOptionsComponent, {
      
    });
  }

  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
