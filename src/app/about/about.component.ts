import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	loading: boolean = false;
	
  constructor() { }

  ngOnInit(): void {
  }

}
