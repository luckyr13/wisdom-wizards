import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ArweaveService } from '../auth/arweave.service';
import { Observable } from 'rxjs';

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

}
