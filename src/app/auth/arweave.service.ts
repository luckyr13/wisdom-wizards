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

  constructor() {
  	this.arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
  }

  getNetworkInfo(): Observable<INetworkResponse> {
  	const obs = new Observable<INetworkResponse>((subscriber) => {
  		// Get network info
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

  getAccount(): Observable<any> {
    const obs = new Observable<any>((subscriber) => {
      // Get network info
      this.arweave.wallets.getAddress().then((res: any) => {
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

}
