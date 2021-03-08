import { readContract, interactWrite, createContract } from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsContract
{
	// private _contractAddress: string = 'Bg2yem2w0dWkTHbO9xpCtXnC9BV2ptLZ5BiZVjFcDC8';
	private _contractAddress: string = '-KUy-Gv2sD1BZHhUBwsNO075PVYX6NLudK73D2SH_5Y';

	constructor() {

	}

	getState(arweave: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			readContract(arweave, this._contractAddress).then((state) => {
				subscriber.next(state);
				subscriber.complete();
			}).catch((error) => {
				subscriber.error(error);
			});

		});

		return obs;
	}

	register(arweave: any, walletJWK: any): Observable<any>  {
		const obs = new Observable((subscriber) => {
			const input = { function: 'registerUser' };
			interactWrite(arweave, walletJWK, this._contractAddress, input).then((state) => {
				subscriber.next(state);
				subscriber.complete();
			}).catch((error) => {
				subscriber.error(error);
			});

		});

		return obs;
	}

}