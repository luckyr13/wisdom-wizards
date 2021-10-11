import { Component, OnInit, AfterViewInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component'
import { ArweaveService } from '../core/arweave.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import anime from 'animejs';


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
    this.animateWisdomTxt();
  }

  animateWisdomTxt() {
    anime({
      targets: '.txt-color-anime',
      color: this.randomColor,
      duration: 2000,
      direction: 'alternate',
      easing: 'linear',
      complete: () => {
        this.animateWisdomTxt();
      }
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
