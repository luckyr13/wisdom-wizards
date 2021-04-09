import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
	private _langCodes: any[] = [
		{ code: 'EN', label: 'English', icon: '' },
		{ code: 'FR', label: 'French', icon: '' },
		{ code: 'DE', label: 'German', icon: '' },
		{ code: 'HI', label: 'Hindi', icon: '' },
		{ code: 'ES', label: 'Spanish', icon: '' },

	];

  constructor() { }

  
	/*
	*	@dev Get languages list
	*/
	getLangsLocalCopy() {
		const obs = new Observable<any[]>((subscriber) => {
			try {
				subscriber.next(this._langCodes);
				subscriber.complete();
			} catch (error) {
				subscriber.error(error);
			}
		});

		return obs;
	}
}
