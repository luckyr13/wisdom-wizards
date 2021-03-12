import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	sliderImages: string[] = [
		'./../assets/img/slider1.jpg'
	];
	sliderImage: string = '';

  constructor() {
  	this.sliderImage = this.sliderImages[0];
  }

  ngOnInit(): void {
  }

}
