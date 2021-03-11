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
	private _subjectsLocal: string[] = [
		"Architecture",
		"Art & Culture",
		"Biology & Life Sciences",
		"Business & Management",
		"Chemistry",
		"Communication",
		"Computer Science",
		"Data Analysis & Statistics",
		"Design",
		"Economics & Finance",
		"Education & Teacher Training",
		"Electronics",
		"Energy & Earth Sciences",
		"Engineering",
		"Environmental Studies",
		"Ethics",
		"Food & Nutrition",
		"Health & Safety",
		"History",
		"Humanities",
		"Language",
		"Law",
		"Literature",
		"Math",
		"Medicine",
		"Music",
		"Philanthropy",
		"Philosophy & Ethics",
		"Physics",
		"Science",
		"Social Sciences",
		"Other"
	];
	

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
	*	@dev Alternative to getSubjects
	*/
	getSubjectsLocalCopy() {
		const obs = new Observable<string[]>((subscriber) => {
			try {
				subscriber.next(this._subjectsLocal);
				subscriber.complete();
			} catch (error) {
				subscriber.error(error);
			}
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

	/*
	*	@dev Create a new course
	*/
	createCourse(
		arweave: any,
		walletJWK: any,
		name: string,
		description: string,
		imgUrl: string,
		subject: number,
		price: number
	): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = {
				function: 'createCourse',
	  		name: name,
	  		description: description,
	  		imgUrl: imgUrl,
	  		subject: subject,
	  		price: price
			};

			interactWrite(arweave, walletJWK, this._contractAddress, input)
				.then((result) => {
					subscriber.next(result);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});
		});

		return obs;
	}

	/*
	*	@dev Activate/deactivate course
	*/
	activateDeactivateCourse(
		arweave: any,
		walletJWK: any,
		courseId: number,
		active: boolean
	): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = {
				function: 'updateActiveStatusCourse',
				courseId: courseId,
				active: active
			};

			interactWrite(arweave, walletJWK, this._contractAddress, input)
				.then((result) => {
					subscriber.next(result);
					subscriber.complete();
				}).catch((error) => {
					subscriber.error(error);
				});
		});

		return obs;
	}

}