import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsContract
{
	// private _contractAddress: string = 'Bg2yem2w0dWkTHbO9xpCtXnC9BV2ptLZ5BiZVjFcDC8';
//	private _contractAddress: string = '-KUy-Gv2sD1BZHhUBwsNO075PVYX6NLudK73D2SH_5Y';
	private _contractAddress: string = 'KeOt45twVd0UwSmiY7SteZXuvwBiixb8XaAkXVs3ePE';

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

	/*
	*	@dev Get subjects list as Observable
	*/
	getSubjects(arweave: any, walletJWK: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = { function: 'getSubjects' };
			interactRead(arweave, walletJWK, this._contractAddress, input)
				.then((subjects) => {
					subscriber.next(subjects);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});
		});

		return obs;
	}

	/*
	*	@dev Get courses list as Observable
	*/
	getCourses(arweave: any, walletJWK: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = { function: 'getActiveCourses' };
			interactRead(arweave, walletJWK, this._contractAddress, input)
				.then((courses) => {
					subscriber.next(courses);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});
		});

		return obs;
	}

}