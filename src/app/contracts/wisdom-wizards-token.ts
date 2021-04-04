import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArweaveService } from '../auth/arweave.service';
import { AuthService } from '../auth/auth.service';
import Community from 'community-js';


@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsTokenContract
{
	private _contractAddress: string = 'eCUK6Jrt30GKy_EKkbgExt1G0Qf_AhNAvzu4977E5sw';
	private _community: Community|null = null;
	constructor(private _arweave: ArweaveService, private _auth: AuthService) {
		this._community = new Community(this._arweave.arweave, this._auth.getPrivateKey());
		this._community.setCommunityTx(this._contractAddress);
	}
	/*
	*	@dev Get full contract state as Observable
	*/
	getState(): Observable<any> {
		const obs = new Observable((subscriber) => {
			readContract(this._arweave.arweave, this._contractAddress).then((state) => {
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
	*	Returns arweave address
	*/
	getContractAddres(): string {
		return this._contractAddress;
	}

}