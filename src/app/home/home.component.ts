import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	private _sliderImages: string[] = [
		'./../assets/img/slider1.jpg',
		'./../assets/img/slider2.jpg',
		'./../assets/img/slider3.jpg',
		'./../assets/img/slider4.jpg'
	];
	sliderImage: string = '';

  constructor() {
  	this.sliderImage = this.getRandomImg();
  }

  ngOnInit(): void {
  }

  getRandomImg(): string {
  	let img = '';
  	let r = Math.floor(Math.random() * 1000) % this._sliderImages.length;
  	img = this._sliderImages[r];
  	return img;
  }

}
