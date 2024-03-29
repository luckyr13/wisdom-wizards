import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { Observable, of} from 'rxjs';
import { ArweaveService } from '../../core/arweave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ModalFileManagerComponent 
} from '../../shared/modal-file-manager/modal-file-manager.component';
import { AuthService } from '../../auth/auth.service';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
	loading: boolean = false;
	loadingFrm: boolean = false;
	frmNew: UntypedFormGroup = new UntypedFormGroup({
		name: new UntypedFormControl('', Validators.required),
		description: new UntypedFormControl(''),
		imgUrl: new UntypedFormControl(''),
		subject: new UntypedFormControl(''),
		price: new UntypedFormControl('0'),
    langCode: new UntypedFormControl('')
	});
	subjects: Observable<any[]> = of([]);

  langCodes: Observable<any[]> = this._language
    .getLangsLocalCopy();

  txmessage: string = '';
  previewImgUrl: string = '';
  routeLang: string = '';

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
    public _dialog: MatDialog,
    private _auth: AuthService,
    private _language: LanguageService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeLang = this._route.snapshot.paramMap.get('lang')!;
    this._route.paramMap.subscribe((params) => {
      this.routeLang = params.get('lang')!;
    })
  }

  goBack() {
  	this._location.back();
  }

  async onSubmit() {
  	const name = this.name!.value;
  	const description = this.description!.value;
  	const imgUrl = this.imgUrl!.value;
  	const subject = this.subject!.value;
  	const price = this.price!.value;
    const langCode = this.langCode!.value;

  	this.disableForm(true);

    try {
      const txid = await this._arweave.createNFT(
        name, name, description, 10000,
        this._auth.getMainAddressSnapshot(), 
        this._auth.getPrivateKey(),
        'hola!',
        'text/plain'
      );

      this.loading = true;
      this.message(`Success! TXID: ${txid}`, 'success');
      this.txmessage = `https://viewblock.io/arweave/tx/${txid}`;

      window.setTimeout(() => {
        this._router.navigate(['/dashboard']);
      }, 10000);
    } catch (error) {
      this.message(`Error ${error}`, 'error');
    }
    



    this.disableForm(false);

  	// Save data 
    /*
  	this._wisdomWizards.createCourse(
  		this._arweave.arweave,
  		this._auth.getPrivateKey(),
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
    */
  	
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
    const refFileManager = this._dialog.open(ModalFileManagerComponent, {
      width: '720px',
      data: {}
    });
    refFileManager.afterClosed().subscribe(result => {
      this.imgUrl!.setValue(result);
      this.previewImage(result);
    });
  }

  /*
  *  @dev
  */
  winstonToAr(_v: string) {
    return this._arweave.winstonToAr(_v);
  }
}
