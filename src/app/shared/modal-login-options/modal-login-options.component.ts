import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription, EMPTY } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-login-options',
  templateUrl: './modal-login-options.component.html',
  styleUrls: ['./modal-login-options.component.scss']
})
export class ModalLoginOptionsComponent implements OnInit, OnDestroy {
	login$: Subscription = Subscription.EMPTY;
  loading: boolean = false;

  constructor(
  	private _auth: AuthService,
  	private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<ModalLoginOptionsComponent>,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.loading = false;
    
  }

  ngOnDestroy(): void {
  	if (this.login$) {
  		this.login$.unsubscribe();
  	}
  }

  login(walletOption: string) {
    this.loading = true;

  	this.login$ = this._auth.login(walletOption).subscribe({
  		next: (res: any) => {
        this.loading = false;
        this._bottomSheetRef.dismiss();
        this._router.navigate(['/dashboard']);
  		},
  		error: (error) => {
        this.message(`Error: ${error}`);
        this.loading = false;
        this._bottomSheetRef.dismiss();

  		}
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
