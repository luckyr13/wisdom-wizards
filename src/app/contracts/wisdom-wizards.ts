import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
	// private _contractAddress: string = 'lmOgf5O5wNiFi45rL5QMkB-bAEF5c-Yc0IZyoSCV-eU';
	//private _contractAddress: string = 'yowLo9OICoqnUJNwt55a0uZ_zrnV01laKReWUJWZyjA';
	private _contractAddress: string = '7Dp5r-UpZLDvHqsDbZbqWhCBwbYdJMKBuC3tFC-FF7U';
	

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
				.then((tx) => {
					subscriber.next(tx);
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
		price: number,
		langCode: string
	): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = {
				function: 'createCourse',
	  		name: name,
	  		description: description,
	  		imgUrl: imgUrl,
	  		subject: subject,
	  		price: price,
	  		langCode: langCode
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


	/*
	*	@dev Get course detail
	*/
	getCourseDetail(arweave: any, walletJWK: any, courseId: number): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = { 
				function: 'getCourseDetail',
				courseId: courseId
			};
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
	*	@dev Update course
	*/
	updateCourse(
		arweave: any,
		walletJWK: any,
		name: string,
		description: string,
		imgUrl: string,
		subject: number,
		price: number,
		langCode: string,
		active: boolean,
		courseId: number
	): Observable<any> {
		const obs = new Observable((subscriber) => {
			const input = {
				function: 'updateCourseInfo',
	  		name: name,
	  		description: description,
	  		imgUrl: imgUrl,
	  		subject: subject,
	  		price: price,
	  		langCode: langCode,
	  		active: active,
	  		courseId: courseId
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
	*	@dev Get full contract state as Observable
	* and filter active courses
	*/
	getActiveCoursesFromState(arweave: any): Observable<any> {
		return this.getState(arweave).pipe(
			switchMap((state) => {
				return new Observable((subscriber) => {
					const courses = state.courses;
					const activeCoursesBySubject: any = {};

					for (let courseId in courses) {
						// Save course
						if (!Object.prototype.hasOwnProperty.call(
							activeCoursesBySubject, courses[courseId].subject
						)) {
							activeCoursesBySubject[courses[courseId].subject] = [];
						}
						if (courses[courseId].active) {
							courses[courseId].id = courseId;
							activeCoursesBySubject[courses[courseId].subject].push(courses[courseId]);
						}
					}
					subscriber.next(activeCoursesBySubject);
					subscriber.complete();
					// subscriber.error(error);
				});
			})
		);
	}

	/*
	*	@dev Get full contract state as Observable
	* and return course by courseId
	*/
	getCourseDetailFromState(arweave: any, courseId: number): Observable<any> {
		return this.getState(arweave).pipe(
			switchMap((state) => {
				return new Observable((subscriber) => {
					const courses = state.courses;
					// On error
					if (!Object.prototype.hasOwnProperty.call(courses, courseId)) {
						subscriber.error('Course not found: Invalid courseId');
					}
					// On success
					subscriber.next(courses[courseId]);
					subscriber.complete();
					
				});
			})
		);
	}
}