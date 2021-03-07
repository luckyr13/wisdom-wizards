import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../auth/arweave.service';
import { Subscription, EMPTY, Observable } from 'rxjs';
import { INetworkResponse } from '../auth/INetworkResponse';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy {
  account: Observable<string> = this._auth.account$;
	network: Observable<string> = this._arweave.getNetworkName();
  @Input() opened!: boolean;
  @Output() openedChange = new EventEmitter<boolean>();

  constructor(
  	private _bottomSheet: MatBottomSheet,
  	private _auth: AuthService,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  	
  }


  toggleSideMenu() {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
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
