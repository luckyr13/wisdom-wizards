import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { Observable, Subscription } from 'rxjs';
import { ArweaveService } from '../../core/arweave.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ModalFileManagerComponent 
} from '../../shared/modal-file-manager/modal-file-manager.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SubjectService } from '../../core/subject.service';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	loadingFrm: boolean = false;
	detail$: Subscription = Subscription.EMPTY;
	detail: any = null;
	frmEdit: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl(''),
		imgUrl: new FormControl(''),
		subject: new FormControl(''),
		price: new FormControl('0'),
    langCode: new FormControl(''),
    status: new FormControl(false)
	});
	subjects: Observable<any[]> = this._subject
		.getSubjectsLocalCopy();

  langCodes: Observable<any[]> = this._language
    .getLangsLocalCopy();
  courseId: number = 0;

  txmessage: string = '';
  previewImgUrl: string = '';

	public get name() {
		return this.frmEdit.get('name');
	}
	public get description() {
		return this.frmEdit.get('description');
	}
	public get imgUrl() {
		return this.frmEdit.get('imgUrl');
	}
	public get subject() {
		return this.frmEdit.get('subject');
	}
	public get price() {
		return this.frmEdit.get('price');
	}
  public get langCode() {
    return this.frmEdit.get('langCode');
  }
  public get status() {
    return this.frmEdit.get('status');
  }

  constructor(
  	private _location: Location,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
  	private _router: Router,
    public _dialog: MatDialog,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _language: LanguageService,
    private _subject: SubjectService
  ) { }

  ngOnInit(): void {
    this.courseId = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.loading = true;

    /*
    this.detail$ = this._wisdomWizards.getCourseDetail( 
      this._arweave.arweave, this._auth.getPrivateKey(), this.courseId
    ).subscribe({
      next: async (data) => {
        this.detail = data;
        // If not the owner
        if (this.detail.createdBy != this._auth.getMainAddressSnapshot()) {
        	this.message('Error', 'error');
        	return;
        }

        this.name!.setValue(this.detail.name);
        this.description!.setValue(this.detail.description);
        this.subject!.setValue(this.detail.subject);
        this.price!.setValue(this.detail.price);
        this.langCode!.setValue(this.detail.langCode);
        this.imgUrl!.setValue(this.detail.imgUrl);
        this.previewImage(this.detail.imgUrl);
        this.status!.setValue(this.detail.active);
        this.loading = false;
      },
      error: (error) => {
        this.message(error, 'error');
      }
    });
    */

  }

  ngOnDestroy() {
  	if (this.detail$) {
  		this.detail$.unsubscribe();
  	}
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
    const active = this.status!.value;

  	this.disableForm(true);

  	// Save data 
    /*
  	this._wisdomWizards.updateCourse(
  		this._arweave.arweave,
  		this._auth.getPrivateKey(),
  		name,
  		description,
  		imgUrl,
  		subject,
  		price,
      langCode,
      active,
      this.courseId
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
      this.status!.disable();
	  	this.loadingFrm = true;
  	} else {
  		this.name!.disable();
	  	this.description!.disable();
	  	this.imgUrl!.disable();
	  	this.subject!.disable();
	  	this.price!.disable();
      this.langCode!.disable();
      this.status!.disable();
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
