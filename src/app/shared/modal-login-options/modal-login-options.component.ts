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
    // this.loading = true;

    // this.loading = false;
    
  }

  /*
  *  @dev Destroy subscriptions
  */
  ngOnDestroy(): void {
  	if (this.login$) {
  		this.login$.unsubscribe();
  	}
  }

  /*
  *  @dev Listen for click on HTML element
  */
  uploadFileListener(fileUploader: any) {
    fileUploader.click();
  }

  /*
  *  @dev Select a method to connect wallet from modal (or bottom sheet)
  */
  login(walletOption: string, fileInput: any = null) {
    this.loading = true;

  	this.login$ = this._auth.login(walletOption, fileInput).subscribe({
  		next: (res: any) => {
        this._bottomSheetRef.dismiss();
        this.loading = false;
        this._router.navigate(['/dashboard']);
  		},
  		error: (error) => {
        this.message(`Error: ${error}`);
        this.loading = false;
        this._bottomSheetRef.dismiss();

  		}
  	});
  }

  /*
  *  @dev Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
