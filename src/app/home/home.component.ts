import { Component, OnInit, AfterViewInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component'
import { ArweaveService } from '../core/arweave.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import anime from 'animejs';
declare const document: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
	private _sliderImages: string[] = [
		'./assets/img/slider1.jpg',
		'./assets/img/slider2.jpg',
		'./assets/img/slider3.jpg',
    './assets/img/slider4.jpg',
    './assets/img/slider5.jpg',
    './assets/img/slider6.jpg',
    './assets/img/slider8.jpg'
	];
	sliderImage: string = '';

  constructor(
    private _bottomSheet: MatBottomSheet,
    private _arweave: ArweaveService,
    private _router: Router,
    private _auth: AuthService
  ) {
  	this.sliderImage = this.getRandomImg();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    // Wrap every letter in a span
    this.createWrapper('.txt-color-anime');
    this.createWrapper('.secondary-title');
    this.animateWisdomTxt('.txt-color-anime');
    this.animateSubWisdomTxt('.secondary-title', false, false);
  }

  createWrapper(_container: string) {
    var textWrapper = document.querySelector(_container);
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
  }

  animateWisdomTxt(
    _txtContainer: string,
    _animateColors: boolean = true,
    _loop: boolean = true) {
    anime.timeline({loop: _loop})
      .add({
        targets: _txtContainer + ' .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i+1)
      }).add({
        targets: _txtContainer + ' .letter',
        color: () => {
          let color = '';
          if (_animateColors) {
            color = this.randomColor();
          }
          return color;
        },
        duration: 8000,
        direction: 'alternate',
        easing: 'linear',
      }).add({
        targets: _txtContainer,
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }

  animateSubWisdomTxt(
    _txtContainer: string,
    _animateColors: boolean = true,
    _loop: boolean = true) {
    anime.timeline({loop: _loop})
      .add({
        targets: _txtContainer + ' .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i+1)
      }).add({
        targets: _txtContainer + ' .letter',
        color: () => {
          let color = '';
          if (_animateColors) {
            color = this.randomColor();
          }
          return color;
        },
        duration: 8000,
        direction: 'alternate',
        easing: 'linear',
      });
  }

  randomColor() {
    const colors = ['59f273', 'b058f4', 'ef585d', 'ef58e8', 'fff53a', 'b5fffd'];
    const randomIndex = Math.floor( (Math.random() * 100) % colors.length );
    const res = `#${colors[randomIndex]}`;
    return res;
  }


  /*
  *  @dev Select a random image from sliders array
  */
  getRandomImg(): string {
  	let img = '';
  	let r = Math.floor(Math.random() * 1000) % this._sliderImages.length;
  	img = this._sliderImages[r];
  	return img;
  }


  /*
  *  @dev Modal login (or bottom sheet)
  */
  login() {
    const mainAccount = this._auth.getMainAddressSnapshot();
    if (mainAccount) {
      this._router.navigate(['/dashboard']);
    } else {
      this._bottomSheet.open(ModalLoginOptionsComponent, {
        
      });
    }
    
  }

}
