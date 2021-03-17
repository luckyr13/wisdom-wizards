import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsTokenContract
{
	private _contractAddress: string = 'eCUK6Jrt30GKy_EKkbgExt1G0Qf_AhNAvzu4977E5sw';
	constructor() {

	}
	/*
	*	@dev Get full contract state as Observable
	*/
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

	/*
	*	@dev Register main address in contract as user
	*/
	register(arweave: any, walletJWK: any): Observable<any>  {
		const obs = new Observable((subscriber) => {
			const input = { function: 'registerUser' };
			interactWrite(arweave, walletJWK, this._contractAddress, input)
				.then((state) => {
					subscriber.next(state);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});

		});

		return obs;
	}

	/*
	*	@dev Get user info as Observable
	*/
	getUserInfo(arweave: any, walletJWK: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = { function: 'getMyUserData' };
			interactRead(arweave, walletJWK, this._contractAddress, input)
				.then((userInfo) => {
					subscriber.next(userInfo);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});
		});

		return obs;
	}

	/*
	*	Returns arweave address
	*/
	getContractAddres(): string {
		return this._contractAddress;
	}

}