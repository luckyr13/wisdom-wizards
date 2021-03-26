import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from '../shared/modal-login-options/modal-login-options.component'
import { ArweaveService } from '../auth/arweave.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	private _sliderImages: string[] = [
		'./assets/img/slider1.jpg',
		'./assets/img/slider2.jpg',
		'./assets/img/slider3.jpg',
		'./assets/img/slider4.jpg'
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
