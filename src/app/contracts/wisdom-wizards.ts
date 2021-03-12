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
	//private _contractAddress: string = 'KeOt45twVd0UwSmiY7SteZXuvwBiixb8XaAkXVs3ePE';
	//private _contractAddress: string = 'kcE9B_T3H8zNHWghiSi5HLx6JnF5-znizCecIRWiy64';
	// Very buggy
	// private _contractAddress: string = 'sdOMIHnYrrco6rnl_yJGZirqO54SMhxhdGV9RC8xyyY';
	//private _contractAddress: string = 'WJd5hDNlEVaDCBF6wuau1S1HEqNgzgnVlXMPNK1psXU';
	// private _contractAddress: string = 'kHbA2BJCkX2jj1RGpVohp8ihzk6kKlCYoxaZOIPhL14';
	private _contractAddress: string = 'lmOgf5O5wNiFi45rL5QMkB-bAEF5c-Yc0IZyoSCV-eU';
	
	private _subjectsLocal: any[] = [
		{ id: 0, label: "Architecture", icon: ""},
		{ id: 1, label: "Art & Culture", icon: ""},
		{ id: 2, label: "Biology & Life Sciences", icon: ""},
		{ id: 3, label: "Business & Management", icon: ""},
		{ id: 4, label: "Chemistry", icon: ""},
		{ id: 5, label: "Communication", icon: ""},
		{ id: 6, label: "Computer Science", icon: ""},
		{ id: 7, label: "Data Analysis & Statistics", icon: ""},
		{ id: 8, label: "Design", icon: ""},
		{ id: 9, label: "Economics & Finance", icon: ""},
		{ id: 10, label: "Education & Teacher Training", icon: ""},
		{ id: 11, label: "Electronics", icon: ""},
		{ id: 12, label: "Energy & Earth Sciences", icon: ""},
		{ id: 13, label: "Engineering", icon: ""},
		{ id: 14, label: "Environmental Studies", icon: ""},
		{ id: 15, label: "Ethics", icon: ""},
		{ id: 16, label: "Food & Nutrition", icon: ""},
		{ id: 17, label: "Health & Safety", icon: ""},
		{ id: 18, label: "History", icon: ""},
		{ id: 19, label: "Humanities", icon: ""},
		{ id: 20, label: "Language", icon: ""},
		{ id: 21, label: "Law", icon: ""},
		{ id: 22, label: "Literature", icon: ""},
		{ id: 23, label: "Math", icon: ""},
		{ id: 24, label: "Medicine", icon: ""},
		{ id: 25, label: "Music", icon: ""},
		{ id: 26, label: "Philanthropy", icon: ""},
		{ id: 27, label: "Philosophy & Ethics", icon: ""},
		{ id: 28, label: "Physics", icon: ""},
		{ id: 29, label: "Science", icon: ""},
		{ id: 30, label: "Social Sciences", icon: ""},
		{ id: 31, label: "Other", icon: ""},
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
		const obs = new Observable<any[]>((subscriber) => {
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

	/*
	*	@dev Get my list of created courses as Observable
	*/
	getMyCreatedCourses(arweave: any, walletJWK: any): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = { function: 'getAllMyCreatedCourses' };
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