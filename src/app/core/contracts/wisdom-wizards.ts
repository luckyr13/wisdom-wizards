import { 
	interactWrite
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ArweaveService } from '../arweave.service';
import { RedstoneSmartweaveService } from '../redstone-smartweave.service';

@Injectable({
  providedIn: 'root'
})
export class WisdomWizardsContract
{
	private _contractAddress: string = 'QBR8RtXdBbsAwQILIhF3PclOvFMGWdS_pT-ZuQNldWo';

	constructor(
		private _arweave: ArweaveService,
		private _smartweave: RedstoneSmartweaveService
	) {
		
	}


	/*
	*	@dev Get full contract state as Observable
	*/
	getState(): Observable<any> {
		return this._smartweave.readState(this._contractAddress);
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
	getSubjects(): Observable<any> {
		const metadata: any = {
			"architecture": {
				icon: "architecture"
			},
			"art_and_culture": {
				icon: "palette"
			},
			"biology_and_life_sciences": {
				icon: "biotech"
			},
			"business_and_management": {
				icon: "business"
			},
			"chemistry": {
				icon: "science"
			},
			"communication": {
				icon: "campaign"
			},
			"computer_science": {
				icon: "computer"
			},
			"data_analysis_and_statistics": {
				icon: "query_stats"
			},
			"design": {
				icon: "design_services"
			},
			"economics_and_finance": {
				icon: "attach_money"
			},
			"education_and_teacher_training": {
				icon: "cast_for_education"
			},
			"electronics": {
				icon: "memory"
			},
			"energy_and_earth_sciences": {
				icon: "battery_charging_full"
			},
			"engineering": {
				icon: "engineering"
			},
			"environmental_studies": {
				icon: "eco"
			},
			"ethics": {
				icon: "extension"
			},
			"food_and_nutrition": {
				icon: "dinner_dining"
			},
			"health_and_safety": {
				icon: "health_and_safety"
			},
			"history": {
				icon: "travel_explore"
			},
			"humanities": {
				icon: "group_work"
			},
			"language": {
				icon: "language"
			},
			"law": {
				icon: "gavel"
			},
			"literature": {
				icon: "book"
			},
			"math": {
				icon: "calculate"
			},
			"medicine": {
				icon: "medication"
			},
			"music": {
				icon: "music_note"
			},
			"philanthropy": {
				icon: "volunteer_activism"
			},
			"philosophy_and_ethics": {
				icon: "psychology"
			},
			"physics": {
				icon: "straighten"
			},
			"science": {
				icon: "precision_manufacturing"
			},
			"social_sciences": {
				icon: "people"
			},
			"other": {
				icon: "auto_fix_high"
			}
		};
		
		return this.getState().pipe(
				map((res) => {
					const { state, validity } = res;
					const subjects = state.subjects;
					for (const slug in subjects) {
						const icon = Object.prototype.hasOwnProperty.call(metadata, slug) ?
							metadata[slug] : '';
						subjects[slug].icon = metadata[slug].icon;
					}
					return subjects;
				})
			);
	}


	/*
	*	@dev Get subjects list as Observable
	*/
	getSubject(slug: string): Observable<any> {
		return this.getSubjects().pipe(
				map((res) => {
					const subjects = res;
					let subject = null;
					if (Object.prototype.hasOwnProperty.call(subjects, slug)) {
						subject = subjects[slug];
					} else {
						throw Error('Subject not found.');
					}
					return subject;
				})
			);
	}

	getAllCourses() {
		return this.getState().pipe(
				map((res) => {
					const { state, validity } = res;
					const courses = state.courses;
					return courses;
				})
			);
	}

	getCourses(lang: string, subject?: string, active: boolean = true) {
		return this.getAllCourses().pipe(
				map((courses) => {
					let filteredCourses: any = {};
					if (Object.prototype.hasOwnProperty.call(courses, lang) &&
							subject &&
							Object.prototype.hasOwnProperty.call(courses[lang], subject)) {
							const tmpList = courses[lang];

							for (const slug in tmpList) {
								if (active && tmpList[slug].active && tmpList[slug].subject === subject) {
									filteredCourses[slug] = tmpList[slug];
								} else if (!active && tmpList[slug].subject === subject) {
									filteredCourses[slug] = tmpList[slug];
								}
							}
						}
					else if (Object.prototype.hasOwnProperty.call(courses, lang)) {
						const tmpList = courses[lang];
						if (active) {
							for (const slug in tmpList) {
								if (tmpList[slug].active) {
									filteredCourses[slug] = tmpList[slug];
								}
							}
						} else {
							filteredCourses = courses[lang];
						}

					}
					return filteredCourses;
				})
			);
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
	getActiveCoursesFromState(): Observable<any> {
		return this.getState().pipe(
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
		return this.getState().pipe(
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