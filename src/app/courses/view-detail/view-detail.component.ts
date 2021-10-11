import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ArweaveService } from '../../core/arweave.service';
import {  WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { getVerification } from "arverify";
import { AuthService } from '../../auth/auth.service';
import { SubjectService } from '../../core/subject.service';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit, OnDestroy {
  detail: any = null;
  detail$: Subscription = Subscription.EMPTY;
  loading: boolean = false;
  verification: any = null;

  constructor(
    private _location: Location,
    private _arweave: ArweaveService,
    private _wisdomWizards: WisdomWizardsContract,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _subject: SubjectService
   ) { }

  ngOnInit(): void {
    const courseId = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.loading = true;

    this.detail$ = this._wisdomWizards.getCourseDetailFromState( 
      this._arweave.arweave, courseId
    ).subscribe({
      next: async (data) => {
        this.detail = data;
        if (this.detail.active) {
          this.verification = await getVerification(this.detail.createdBy);

        } else {
          this.message('Course not found', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.message(error, 'error');
      }
    });

  }

  ngOnDestroy() {
    if (this.detail$) {
      this.detail$.unsubscribe();
    }
  }

  /*
  *  @dev Navigate to previous page
  */
  goBack() {
  	this._location.back();
  }


  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  * @dev
  */
  winstonToAr(_v: string) {
    return this._arweave.winstonToAr(_v);
  }

  /*
  * @dev
  */
  getSubjectDetail(_subjectId: number) {
    return this._subject.getSubjectDetailLocalCopy(_subjectId);
  }

  /*
  * #dev
  */
  searchMeInUsersEnrolled(_users: string[]) {
    return _users.find(el => el === this._auth.getMainAddressSnapshot());
  }
}
