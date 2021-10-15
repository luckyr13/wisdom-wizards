import { 
	readContract, interactWrite, interactRead
} from 'smartweave';
import { SmartWeaveWebFactory, ArWallet, Contract, SmartWeave } from 'redstone-smartweave';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ArweaveService } from '../arweave.service';

@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsContract
{
	private _contractAddress: string = 'QBR8RtXdBbsAwQILIhF3PclOvFMGWdS_pT-ZuQNldWo';	
	private _smartweave: SmartWeave;
	private _contract: Contract;

	constructor(private _arweave: ArweaveService) {
		this._smartweave = SmartWeaveWebFactory.memCached(this._arweave.arweave);
		this._contract = this._smartweave.contract(this._contractAddress);
	}

	getConnectedContract(wallet: ArWallet) {
		const contract = this._smartweave.contract(
				this._contractAddress
			).connect(
				wallet
			).setEvaluationOptions({
		    // with this flag set to true, 
		    // the write will wait for the transaction to be confirmed
		    waitForConfirmation: true,
		  });
		return contract;
	}

	/*
	*	@dev Get full contract state as Observable
	*/
	getState(blockHeight?: number): Observable<any> {
		return from(this._contract.readState(blockHeight));
	}

	
	/*
	*	Returns arweave address
	*/
	getContractAddres(): string {
		return this._contractAddress;
	}

	getLanguages() {
		return this.getState().pipe(
				map((res) => {
					const { state, validity } = res;
					const langs = state.languages;
					return langs;
				})
			);
	}

	/*
	*	@dev Get subjects list as Observable
	*/
	getSubjects(arweave: any, walletJWK: any): Observable<any> {
		

		return of(null);
	}


	/*
	*	@dev Get courses list as Observable
	*/
	getCourses(arweave: any, walletJWK: any): Observable<any> {
		

		return of(null);
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
		

		return of(null);
	}


	/*
	*	@dev Get course detail
	*/
	getCourseDetail(arweave: any, walletJWK: any, courseId: number): Observable<any> {
		
		return of(null);
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