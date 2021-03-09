import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { INetworkResponse } from './INetworkResponse';
import Arweave from 'arweave';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {
  arweave: any = null;
  private _key: any = null;
  private _mainAddress: string = '';

  constructor() {
  	this.arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
    const arkey = window.sessionStorage.getItem('ARKEY');
    const mainAddress = window.sessionStorage.getItem('MAINADDRESS');
    if (arkey) {
      this._key = JSON.parse(arkey);
    }
    if (mainAddress) {
      this._mainAddress = mainAddress;
    }
  }

  getNetworkInfo(): Observable<INetworkResponse> {
  	const obs = new Observable<INetworkResponse>((subscriber) => {
  		// Get network's info
  		this.arweave.network.getInfo().then((res: INetworkResponse) => {
  			subscriber.next(res);
  			subscriber.complete();
	  	}).catch((error: any) => {
	  		subscriber.error(error);
	  	});
  	})

  	return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  getNetworkName(): Observable<string> {
    const obs = new Observable<string>((subscriber) => {
      // Get network's name
      this.arweave.network.getInfo().then((res: INetworkResponse) => {
        subscriber.next(res.network);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  getAccount(): Observable<any> {
    const obs = new Observable<any>((subscriber) => {
      // Get main account
      // very similar to window.ethereum.enable
      this.arweave.wallets.getAddress().then((res: any) => {
        // Save main address for convenience 
        this._mainAddress = res.toString();
        window.sessionStorage.setItem('MAINADDRESS', this._mainAddress);
        
        subscriber.next(res);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );

  }

  errorHandler(
  	error: any
  ) {
    let errorMsg = 'Error connecting to Arweave network/wallet';
    console.log('Debug', error);
    return throwError(errorMsg);
  }

  uploadKeyFile(inputEvent: any): Observable<any> {
    let method = new Observable<any>((subscriber) => {
       // Transform .json file into key
       try {
        const file = inputEvent.target.files.length ? 
          inputEvent.target.files[0] : null;

        const freader = new FileReader();
        freader.onload = async (_keyFile) => {
          const key = JSON.parse(freader.result + '');
          // Save key in global property for convenience :)
          this._key = key;
          window.sessionStorage.setItem('ARKEY', JSON.stringify(this._key));

          try {
            const address = await this.arweave.wallets.jwkToAddress(key);
            // Save main address for convenience 
            this._mainAddress = address;
            window.sessionStorage.setItem('MAINADDRESS', this._mainAddress);

            subscriber.next(address);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading key');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }

        freader.readAsText(file);

       } catch (error) {
         subscriber.error(error);
       }
      
    });

    return method;

  }

  getAccountBalance(_address: string): Observable<any> {
    const obs = new Observable<any>((subscriber) => {
      // Get balance
      this.arweave.wallets.getBalance(_address).then((_balance: string) => {
        let winston = _balance;
        let ar = this.arweave.ar.winstonToAr(_balance);

        subscriber.next(ar);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  getMainAddress() {
    return this._mainAddress;
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

  logout() {
    window.sessionStorage.removeItem('ARKEY');
    window.sessionStorage.removeItem('MAINADDRESS');
  }

}
