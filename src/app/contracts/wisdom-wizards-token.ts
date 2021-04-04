import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Community from 'community-js';


@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsTokenContract
{
	private _contractAddress: string = 'eCUK6Jrt30GKy_EKkbgExt1G0Qf_AhNAvzu4977E5sw';
	private _community: Community|null = null;
	constructor() {
		
	}

	initCommunity(_arweave: any, privateKey: any) {
		this._community = new Community(_arweave, privateKey);
		this._community.setCommunityTx(this._contractAddress);
	}
	/*
	*	@dev Get full contract state as Observable
	*/
	getState(_arweave: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			readContract(_arweave, this._contractAddress).then((state) => {
				subscriber.next(state);
				subscriber.complete();
			}).catch((error) => {
				subscriber.error(error);
			});

		});

		return obs;
	}

	/*
	 *	@dev Get full contract state as Observable
	 * 	from Community.xyz
	 */
	getCommunityState() {
		const obs = new Observable((subscriber) => {
			this._community!.getState().then((state) => {
				subscriber.next(state);
				subscriber.complete();
			}).catch((error) => {
				subscriber.error(error);
			});

		});

		return obs;
	}

	/*
	 *	@dev Get account balance in WWT
	 */
	getPSTBalance(account: string) {
		const obs = new Observable((subscriber) => {
			this._community!.getBalance().then((balance) => {
				subscriber.next(balance);
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