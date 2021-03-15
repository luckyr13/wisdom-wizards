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
	// private _contractAddress: string = 'lmOgf5O5wNiFi45rL5QMkB-bAEF5c-Yc0IZyoSCV-eU';
	private _contractAddress: string = 'yowLo9OICoqnUJNwt55a0uZ_zrnV01laKReWUJWZyjA';

	private _subjectsLocal: any[] = [
		{ id: 0, label: "Architecture", icon: "architecture"},
		{ id: 1, label: "Art & Culture", icon: "palette"},
		{ id: 2, label: "Biology & Life Sciences", icon: "biotech"},
		{ id: 3, label: "Business & Management", icon: "business"},
		{ id: 4, label: "Chemistry", icon: "science"},
		{ id: 5, label: "Communication", icon: "campaign"},
		{ id: 6, label: "Computer Science", icon: "computer"},
		{ id: 7, label: "Data Analysis & Statistics", icon: "query_stats"},
		{ id: 8, label: "Design", icon: "design_services"},
		{ id: 9, label: "Economics & Finance", icon: "attach_money"},
		{ id: 10, label: "Education & Teacher Training", icon: "cast_for_education"},
		{ id: 11, label: "Electronics", icon: "memory"},
		{ id: 12, label: "Energy & Earth Sciences", icon: "battery_charging_full"},
		{ id: 13, label: "Engineering", icon: "engineering"},
		{ id: 14, label: "Environmental Studies", icon: "eco"},
		{ id: 15, label: "Ethics", icon: "extension"},
		{ id: 16, label: "Food & Nutrition", icon: "dinner_dining"},
		{ id: 17, label: "Health & Safety", icon: "health_and_safety"},
		{ id: 18, label: "History", icon: "travel_explore"},
		{ id: 19, label: "Humanities", icon: "group_work"},
		{ id: 20, label: "Language", icon: "language"},
		{ id: 21, label: "Law", icon: "gavel"},
		{ id: 22, label: "Literature", icon: "book"},
		{ id: 23, label: "Math", icon: "calculate"},
		{ id: 24, label: "Medicine", icon: "medication"},
		{ id: 25, label: "Music", icon: "music_note"},
		{ id: 26, label: "Philanthropy", icon: "volunteer_activism"},
		{ id: 27, label: "Philosophy & Ethics", icon: "psychology"},
		{ id: 28, label: "Physics", icon: "straighten"},
		{ id: 29, label: "Science", icon: "precision_manufacturing"},
		{ id: 30, label: "Social Sciences", icon: "people"},
		{ id: 31, label: "Other", icon: "auto_fix_high"},
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

}