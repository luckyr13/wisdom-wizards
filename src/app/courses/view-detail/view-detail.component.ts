import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  /*
  *  @dev Navigate to previous page
  */
  goBack() {
  	this._location.back();
  }

}
