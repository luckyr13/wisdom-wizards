import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../auth/arweave.service';
import { Observable } from 'rxjs';
import anime from 'animejs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  account: Observable<string> = this._auth.account$;
  network: Observable<string> = this._arweave.getNetworkName();

  constructor(
  	private _auth: AuthService,
  	private _arweave: ArweaveService
  ) {

  }

  ngOnInit(): void {
  	window.setTimeout(() => {
  		this._auth.setAccount(this._auth.getMainAddressSnapshot());

  	}, 500);
  }


  ngAfterViewInit() {
    anime({
      targets: '.txt-color-anime',
      color: this.randomColor,
      duration: 2000,
      direction: 'alternate',
      easing: 'linear',
      loop: true,
    });
  }

  randomColor() {
    const colors = ['59f273', 'b058f4', 'ef585d', 'ef58e8'];
    const randomIndex = Math.floor( (Math.random() * 100) % colors.length );
    const res = `#${colors[randomIndex]}`;
    return res;
  }

}
