import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { INetworkResponse } from './INetworkResponse';
import Arweave from 'arweave';

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {
  arweave: any = null;
  key: any = null;
  mainAddress: string = '';

  constructor() {
  	this.arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
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
        this.mainAddress = res.toString();
        
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
          this.key = key;

          try {
            const address = await this.arweave.wallets.jwkToAddress(key);
            // Save main address for convenience 
            this.mainAddress = address;

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
      this.arweave.wallets.getBalance(_address).then((res: any) => {
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

}
