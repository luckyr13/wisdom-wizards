import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { INetworkResponse } from './interfaces/INetworkResponse';
import { selectWeightedPstHolder } from 'smartweave';
import Arweave from 'arweave';
import { contractTemplateNFT, INFTStateTemplate, ArweaveContractCreateNFT } from './arweave-contract-create-nft';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {
  arweave: any = null;
  arweaveNFT: ArweaveContractCreateNFT = new ArweaveContractCreateNFT();

  constructor() {
  	this.arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });

  }

  getNetworkInfo(): Observable<INetworkResponse> {
  	const obs = new Observable<INetworkResponse>((subscriber) => {
  		// Get network's info
  		this.arweave.network.getInfo().then((res: INetworkResponse) => {
  			subscriber.next(res);
  			subscriber.complete();
	  	}).catch((error: any) => {
	  		subscriber.error(error);
	  	});
  	})

  	return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  getNetworkName(): Observable<string> {
    const obs = new Observable<string>((subscriber) => {
      // Get network's name
      this.arweave.network.getInfo().then((res: INetworkResponse) => {
        subscriber.next(res.network);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  getAccount(): Observable<any> {
    const obs = new Observable<any>((subscriber) => {
      // Get main account
      // very similar to window.ethereum.enable
      this.arweave.wallets.getAddress().then((res: any) => {
        
        subscriber.next(res);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );

  }

  errorHandler(
  	error: any
  ) {
    let errorMsg = 'Error connecting to Arweave network/wallet';
    console.log('Debug', error);
    return throwError(errorMsg);
  }

  uploadKeyFile(inputEvent: any): Observable<any> {
    let method = new Observable<any>((subscriber) => {
       // Transform .json file into key
       try {
        const file = inputEvent.target.files.length ? 
          inputEvent.target.files[0] : null;

        const freader = new FileReader();
        freader.onload = async (_keyFile) => {
          const key = JSON.parse(freader.result + '');
          try {
            const address = await this.arweave.wallets.jwkToAddress(key);
            const tmp_res = {
              address: address,
              key: key
            };
            
            subscriber.next(tmp_res);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading key');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }

        freader.readAsText(file);

       } catch (error) {
         subscriber.error(error);
       }
      
    });

    return method;

  }

  /*
  * @dev
  */
  winstonToAr(balance: string) {
    return this.arweave.ar.winstonToAr(balance);
  }

  /*
  * @dev
  */
  arToWinston(balance: string) {
    return this.arweave.ar.arToWinston(balance);
  }


  /*
  * @dev
  */
  getAccountBalance(_address: string): Observable<any> {
    const obs = new Observable<any>((subscriber) => {
      // Get balance
      this.arweave.wallets.getBalance(_address).then((_balance: string) => {
        let winston = _balance;
        let ar = this.winstonToAr(_balance);

        subscriber.next(ar);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  logout() {
    window.sessionStorage.removeItem('ARKEY');
    window.sessionStorage.removeItem('MAINADDRESS');
  }

  getLastTransactionID(_address: string): Observable<string> {
    const obs = new Observable<string>((subscriber) => {
      this.arweave.wallets.getLastTransactionID(_address).then((res: string) => {
        subscriber.next(res);
        subscriber.complete();
      }).catch((error: any) => {
        subscriber.error(error);
      });
    })

    return obs.pipe(
      catchError(this.errorHandler)
    );
  }

  fileToArrayBuffer(file: any): Observable<any> {
    let method = new Observable<any>((subscriber) => {
    // Transform .json file into key
    try {
        const freader = new FileReader();
        freader.onload = async () => {
          const data = freader.result;
          try {
            subscriber.next(data);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading file');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }

        freader.readAsArrayBuffer(file);

       } catch (error) {
         subscriber.error(error);
       }
      
    });
    return method;
  }

  async uploadFileToArweave(fileBin: any, contentType: string, key: any): Promise<any> {
    // Create transaction
    let transaction = await this.arweave.createTransaction({
        data: fileBin,
    }, key);

    // https://github.com/ArweaveTeam/arweave-standards/blob/master/best-practices/BP-105.md
    transaction.addTag('App-Name', 'Wisdom Wizards');
    transaction.addTag('App-Version', '1.0.0');
    transaction.addTag('Content-Type', contentType);

    // Sign transaction
    await this.arweave.transactions.sign(transaction, key);

    // Submit transaction 
    let uploader = await this.arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    return transaction;
  }


  async sendFee(_contractState: any, _fee: string, jwk: any): Promise<any> {
    const holder = selectWeightedPstHolder(_contractState.balances);
    // send a fee. You should inform the user about this fee and amount.
    const tx = await this.arweave.createTransaction({ 
      target: holder, quantity: this.arweave.ar.arToWinston(_fee) 
    }, jwk)
    await this.arweave.transactions.sign(tx, jwk)
    const response = await this.arweave.transactions.post(tx)
    return {tx: tx, status: response};
  }

  async createNFT(
    name: string,
    ticker: string,
    description: string,
    balance: number,
    owner: string,
    key: any,
    fileData: string,
    fileContentType: string,
    target: string = '',
    winstonQty: string = ''
   ) {
    let txid = '';
    try {
      const contractSrc = contractTemplateNFT;
      const fbalance: any= {};
      fbalance[owner] = balance;
      const initState = this.arweaveNFT.stateToString({
        name: name,
        ticker: ticker,
        description: description,
        balance: fbalance,
        owner: owner
      })
      txid = await this.arweaveNFT.createNFTContract(
        this.arweave,
        key,
        contractSrc,
        initState,
        fileData,
        fileContentType,
        target,
        winstonQty
      );

    } catch (error) {
      throw Error(error);
    }

    return txid;
  }


  async getTxStatus(_tx: string) {
    return await this.arweave.transactions.getStatus(_tx);
  }


}
