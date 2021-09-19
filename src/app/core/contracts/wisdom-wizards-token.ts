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
	*	Returns arweave address
	*/
	getContractAddres(): string {
		return this._contractAddress;
	}

}