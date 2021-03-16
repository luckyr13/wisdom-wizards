import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { WisdomWizardsContract } from '../../contracts/wisdom-wizards';
import { Observable } from 'rxjs';
import { ArweaveService } from '../../auth/arweave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ModalFileManagerComponent 
} from '../../shared/modal-file-manager/modal-file-manager.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
	loading: boolean = false;
	loadingFrm: boolean = false;
	frmNew: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl(''),
		imgUrl: new FormControl(''),
		subject: new FormControl(''),
		price: new FormControl('0'),
    langCode: new FormControl('')
	});
	subjects: Observable<any[]> = this._wisdomWizards
		.getSubjectsLocalCopy();

  langCodes: Observable<any[]> = this._wisdomWizards
    .getLangsLocalCopy();

  txmessage: string = '';
  previewImgUrl: string = '';

	public get name() {
		return this.frmNew.get('name');
	}
	public get description() {
		return this.frmNew.get('description');
	}
	public get imgUrl() {
		return this.frmNew.get('imgUrl');
	}
	public get subject() {
		return this.frmNew.get('subject');
	}
	public get price() {
		return this.frmNew.get('price');
	}
  public get langCode() {
    return this.frmNew.get('langCode');
  }

  constructor(
  	private _location: Location,
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
  	private _router: Router,
    public _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  goBack() {
  	this._location.back();
  }

  onSubmit() {
  	const name = this.name!.value;
  	const description = this.description!.value;
  	const imgUrl = this.imgUrl!.value;
  	const subject = this.subject!.value;
  	const price = this.price!.value;
    const langCode = this.langCode!.value;

  	this.disableForm(true);

  	// Save data 
  	this._wisdomWizards.createCourse(
  		this._arweave.arweave,
  		this._arweave.getPrivateKey(),
  		name,
  		description,
  		imgUrl,
  		subject,
  		price,
      langCode
  	).subscribe({
  		next: (res) => {
        this.disableForm(false);
  			this.loading = true;
        this.message(`Success! TXID: ${res}`, 'success');
        this.txmessage = `https://viewblock.io/arweave/tx/${res}`;

        window.setTimeout(() => {
          this._router.navigate(['/dashboard']);
        }, 10000);
  			// this._router.navigate(['/courses/created']);
  		},
  		error: (error) => {
  			this.message(`Error ${error}`, 'error');
  			// this.disableForm(false);
  		}
  	});

  	
  }

  disableForm(disable: boolean) {
  	if (disable) {
  		this.name!.disable();
	  	this.description!.disable();
	  	this.imgUrl!.disable();
	  	this.subject!.disable();
	  	this.price!.disable();
      this.langCode!.disable();
	  	this.loadingFrm = true;
  	} else {
  		this.name!.disable();
	  	this.description!.disable();
	  	this.imgUrl!.disable();
	  	this.subject!.disable();
	  	this.price!.disable();
      this.langCode!.disable();
	  	this.loadingFrm = false;
  	}
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  previewImage(imgUrl: string) {
    this.previewImgUrl = imgUrl;
  }

  /*
  *  @dev 
  */
  openFileManager() {
    this._dialog.open(ModalFileManagerComponent, {
      width: '720px',
      data: {}
    });
  }

  /*
  *  @dev
  */
  winstonToAr(_v: string) {
    return this._arweave.winstonToAr(_v);
  }
}
