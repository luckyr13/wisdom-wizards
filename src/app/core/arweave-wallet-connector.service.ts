import { Injectable } from '@angular/core';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArweaveWalletConnectorService {
	private _walletData = {
		url: 'arweave.app',
		address: '' as string | undefined,
		keepPopup: false,
		error: '',
		loading: false
	};
	private _wallet: any;

  constructor() {
  	this._wallet = new ArweaveWebWallet({ name: 'Connector Example', logo: `` })
  	this.initWalletEvents();
  }

  initWalletEvents() {
  	this._wallet.on('connect', (address: string) => {
			this._walletData.address = address;
			this._walletData.url = this._wallet.url as string;
		})
		this._wallet.on('disconnect', () => this._walletData.address = undefined);
		this._wallet.on('keepPopup', (keep: any) => this._walletData.keepPopup = keep);
  }

  getWallet() {
  	return this._wallet;
  }

  getWalletData() {
  	return this._walletData;
  }

  connect() {
		this._wallet.setUrl(this._walletData.url);
		this._wallet.connect();
		this.loadingWallet(true);
		this._wallet.once('change', () => this.loadingWallet(false));
		
	}

	loadingWallet(loading: boolean) {
		this._walletData.loading = loading;
	}

	walletOnceChange(callback: Function) {
		this._wallet.once('change', callback);
	}
	
	disconnect() {
		this._wallet.disconnect();
	}
	
	togglePopup() {
		this._wallet.keepPopup = this._wallet.keepPopup;
	} 
}
