import { Injectable } from '@angular/core';
import { ArweaveService } from '../core/arweave.service';
// import { ArweaveWalletConnectorService } from '../core/arweave-wallet-connector.service';
import { Observable, EMPTY, of, throwError, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private account: Subject<string>;
  // Observable string streams
  public account$: Observable<string>;
  // User's private key
  private _key: string = '';
  // User's arweave public address
  private _accountAddress: string = '';

  constructor(
    private _arweave: ArweaveService,
    // private _arWalletConnector: ArweaveWalletConnectorService
  ) {
    this.account = new Subject<string>();
    this.account$ = this.account.asObservable();
  }

  loadSessionData() {
    const arkey = window.sessionStorage.getItem('ARKEY');
    const mainAddress = window.sessionStorage.getItem('MAINADDRESS');
    if (arkey) {
      this._key = JSON.parse(arkey);
    }
    if (mainAddress) {
      this._accountAddress = mainAddress;
      this.setAccount(this._accountAddress);
    }
  }

  setAccount(account: string) {
    this.account.next(account);
    this._setAccountAddress(account);
  }

  private _setAccountAddress(accountAddress: string) {
    // Save main address for convenience 
    this._accountAddress = accountAddress;
    window.sessionStorage.setItem('MAINADDRESS', this._accountAddress);
  }

  setPrivateKey(_key: string) {
    // Save key in global property for convenience :)
    this._key = _key;
    window.sessionStorage.setItem('ARKEY', JSON.stringify(this._key));
  }


  public getMainAddressSnapshot(): string {
    return this._accountAddress;
  }

  getPrivateKey() {
    let res = null;
    if (this._key) {
      res = this._key;
    } else {
      res = 'use_wallet';
    }
    return res;
  }



  login(walletOption: string, uploadInputEvent: any = null): Observable<any> {
  	let method = of({});

  	switch (walletOption) {
  		case 'upload_file':
        method = this._arweave.uploadKeyFile(uploadInputEvent).pipe(
            tap( (_res: any) => {
              this.setAccount(_res.address);
              this.setPrivateKey(_res.key);
            })
          );
  		break;
  		case 'arconnect':
  			method = this._arweave.getAccount().pipe(
            tap( (_account) => {

              this.setAccount(_account.toString());
            })
          );
      break;
      case 'arweaveApp':
        /*
        method = new Observable<any>((subscriber) => {
          // this._arWalletConnector.connect();
          subscriber.next();
          subscriber.complete();
          // subscriber.error();
        });
        */
        method = throwError('Coming soon!');

  		break;

  		default:
        return throwError('Wallet not supported');
  		break;
  	}

  	return method;
  }

  logout() {
    this.setAccount('');
    window.sessionStorage.removeItem('ARKEY');
    window.sessionStorage.removeItem('MAINADDRESS');
  }

}
