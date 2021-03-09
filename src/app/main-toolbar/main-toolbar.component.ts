import { 
  Component, OnInit, OnDestroy, 
  Input, Output, EventEmitter
} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../auth/arweave.service';
import { Subscription, EMPTY, Observable } from 'rxjs';
import { INetworkResponse } from '../auth/INetworkResponse';
import {MatSnackBar} from '@angular/material/snack-bar';
declare const document: any;
declare const window: any;

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
  isLoggedIn: boolean = false;

  constructor(
  	private _bottomSheet: MatBottomSheet,
  	private _auth: AuthService,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._auth.account$.subscribe((_address: string) => {
      if (_address) {
        this.isLoggedIn = true;
      }
    });

    // Check for account on sessionStorage
    window.setTimeout(() => {
      const mainAddress = window.sessionStorage.getItem('MAINADDRESS');
      if (mainAddress) {
        this._auth.setAccount(mainAddress);
      }
    }, 500);

  }

  ngOnDestroy(): void {
  	
  }

  /*
  *  Open/close main menu
  */
  toggleSideMenu() {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }


  /*
  *  @dev Modal login (or bottom sheet)
  */
  login() {
  	this._bottomSheet.open(ModalLoginOptionsComponent, {
      
    });
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  *  Set default theme (Updates the href property)
  */
  setMainTheme(theme: string) {
    const _ts = document.getElementById('LINK_MAIN_TEMPLATE');
    if (!_ts) {
      this.message('Error updating theme', 'error')
      return;
    }
    switch (theme) {
      case 'indigo-pink':
        _ts.href = `./assets/css/${theme}.css`;
      break;
      case 'pink-bluegrey':
        _ts.href = `./assets/css/${theme}.css`;
      break;
      default:
      break;
    }

  }

  /*
  *  @dev Destroy session
  */
  logout() {
    this._auth.logout();
    this.isLoggedIn = false;
    window.location.reload();
  }

}
