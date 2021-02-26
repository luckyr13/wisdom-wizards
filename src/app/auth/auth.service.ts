import { Injectable } from '@angular/core';
import { ArweaveService } from './arweave.service';
import { Observable, EMPTY, of, throwError, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private account: Subject<string>;
  // Observable string streams
  public account$: Observable<string>;

  constructor(private _arweave: ArweaveService) {
    this.account = new Subject<string>();
    this.account$ = this.account.asObservable();
  }

  setAccount(account: string) {
    this.account.next(account);
  }

  login(walletOption: string): Observable<any> {
  	let method = of({});

  	switch (walletOption) {
  		case 'upload_file':

  		break;

  		case 'waveid':

  		break;

  		case 'arconnect':
  			method = this._arweave.getAccount().pipe(
            tap( (_account) => {

              this.setAccount(_account.toString());
            })
          );
  		break;

  		default:
        return throwError('Wallet not supported');
  		break;
  	}

  	return method;
  }
 

}
