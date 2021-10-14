import { 
  Component, OnInit, OnDestroy, 
  Input, Output, EventEmitter
} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../core/arweave.service';
import { Subscription, EMPTY, Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UserSettingsService } from '../core/user-settings.service';
declare const document: any;
declare const window: any;

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy {
  @Input() opened!: boolean;
  @Output() openedChange = new EventEmitter<boolean>();
  isLoggedIn: boolean = false;
  defaultTheme: string = '';

  constructor(
  	private _bottomSheet: MatBottomSheet,
  	private _auth: AuthService,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
    private _userSettings: UserSettingsService
  ) {}

  ngOnInit(): void {
    this._auth.account$.subscribe((_address: string) => {
      if (_address) {
        this.isLoggedIn = true;
      }
    });
    this.defaultTheme = this._userSettings.getDefaultTheme();
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
    this.defaultTheme = theme;
    try {
      this._userSettings.setTheme(theme);
    } catch (err) {
      this.message(`Error: ${err}`, 'error');
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
