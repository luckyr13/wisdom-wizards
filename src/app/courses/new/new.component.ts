import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
	loading: boolean = false;

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  goBack() {
  	this._location.back();
  }

}
