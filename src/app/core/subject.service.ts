import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
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

  constructor() { }

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
	*	@dev Get subject name
	*/
	getSubjectDetailLocalCopy(_subjectId: number) {
		return this._subjectsLocal[_subjectId];
	}
}
